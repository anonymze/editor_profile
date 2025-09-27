import { getErrorMessage } from "@ai-sdk/provider-utils";
import { RetryError } from "ai";

//#region src/get-model-key.ts
/**
* Generate a unique key for a LanguageModelV2 instance.
*/
const getModelKey = (model) => {
	return `${model.provider}/${model.modelId}`;
};

//#endregion
//#region src/create-retryable-model.ts
/**
* Type guard to check if a retry attempt is an error attempt
*/
function isErrorAttempt(attempt) {
	return attempt.type === "error";
}
/**
* Type guard to check if a retry attempt is a result attempt
*/
function isResultAttempt(attempt) {
	return attempt.type === "result";
}
var RetryableModel = class {
	specificationVersion = "v2";
	baseModel;
	currentModel;
	options;
	get modelId() {
		return this.currentModel.modelId;
	}
	get provider() {
		return this.currentModel.provider;
	}
	get supportedUrls() {
		return this.currentModel.supportedUrls;
	}
	constructor(options) {
		this.options = options;
		this.baseModel = options.model;
		this.currentModel = options.model;
	}
	/**
	* Find the next model to retry with based on the retry context
	*/
	async findNextModel(context) {
		/**
		* Filter retryables based on attempt type:
		* - Result-based attempts: Only consider function retryables (skip plain models)
		* - Error-based attempts: Consider all retryables (functions + plain models)
		*/
		const applicableRetries = isResultAttempt(context.current) ? this.options.retries.filter((retry) => typeof retry === "function") : this.options.retries;
		/**
		* Iterate through the applicable retryables to find a model to retry with
		*/
		for (const retry of applicableRetries) {
			const retryModel = typeof retry === "function" ? await retry(context) : {
				model: retry,
				maxAttempts: 1
			};
			if (retryModel) {
				/**
				* The model key uniquely identifies a model instance (provider + modelId)
				*/
				const retryModelKey = getModelKey(retryModel.model);
				/**
				* Find all attempts with the same model
				*/
				const retryAttempts = context.attempts.filter((a) => getModelKey(a.model) === retryModelKey);
				const maxAttempts = retryModel.maxAttempts ?? 1;
				/**
				* Check if the model can still be retried based on maxAttempts
				*/
				if (retryAttempts.length < maxAttempts) return retryModel.model;
			}
		}
	}
	async doGenerate(options) {
		/**
		* Always start with the original model
		*/
		this.currentModel = this.baseModel;
		/**
		* Track number of attempts
		*/
		let totalAttempts = 0;
		/**
		* Track all attempts.
		*/
		const attempts = [];
		/**
		* The previous attempt that triggered a retry, or undefined if this is the first attempt
		*/
		let previousAttempt;
		while (true) {
			/**
			* Call the onRetry handler if provided.
			* Skip on the first attempt since no previous attempt exists yet.
			*/
			if (previousAttempt) {
				/**
				* Context for the onRetry handler
				*/
				const context = {
					current: {
						...previousAttempt,
						model: this.currentModel
					},
					attempts,
					totalAttempts
				};
				/**
				* Call the onRetry handler if provided
				*/
				this.options.onRetry?.(context);
			}
			totalAttempts++;
			try {
				const result = await this.currentModel.doGenerate(options);
				/**
				* Check if the result should trigger a retry
				*/
				const resultAttempt = {
					type: "result",
					result,
					model: this.currentModel
				};
				/**
				* Add the current attempt to the list before checking for retries
				*/
				attempts.push(resultAttempt);
				const resultContext = {
					current: resultAttempt,
					attempts,
					totalAttempts
				};
				const nextModel = await this.findNextModel(resultContext);
				if (nextModel) {
					/**
					* Set the model for the next attempt
					*/
					this.currentModel = nextModel;
					/**
					* Set the previous attempt that triggered this retry
					*/
					previousAttempt = resultAttempt;
					/**
					* Continue to the next iteration to retry
					*/
					continue;
				}
				/**
				* No retry needed, remove the attempt since it was successful and return the result
				*/
				attempts.pop();
				return result;
			} catch (error) {
				/**
				* Current attempt with current error
				*/
				const errorAttempt = {
					type: "error",
					error,
					model: this.currentModel
				};
				/**
				* Save the current attempt
				*/
				attempts.push(errorAttempt);
				/**
				* Context for the retryables and onError handler
				*/
				const context = {
					current: errorAttempt,
					attempts,
					totalAttempts
				};
				/**
				* Call the onError handler if provided
				*/
				this.options.onError?.(context);
				const nextModel = await this.findNextModel(context);
				/**
				* Handler didn't return any models to try next, rethrow the error.
				* If we retried the request, wrap the error into a `RetryError` for better visibility.
				*/
				if (!nextModel) {
					if (totalAttempts > 1) {
						const errorMessage = getErrorMessage(error);
						const errors = attempts.flatMap((a) => isErrorAttempt(a) ? a.error : `Result with finishReason: ${a.result.finishReason}`);
						throw new RetryError({
							message: `Failed after ${totalAttempts} attempts. Last error: ${errorMessage}`,
							reason: "maxRetriesExceeded",
							errors
						});
					}
					throw error;
				}
				/**
				* Set the model for the next attempt
				*/
				this.currentModel = nextModel;
				/**
				* Set the previous attempt that triggered this retry
				*/
				previousAttempt = errorAttempt;
			}
		}
	}
	async doStream(options) {
		throw new Error("Streaming not implemented");
	}
};
function createRetryable(config) {
	return new RetryableModel(config);
}

//#endregion
export { createRetryable, getModelKey, isErrorAttempt, isResultAttempt };
