import { LanguageModelV2 } from "@ai-sdk/provider";

//#region src/types.d.ts
type LanguageModelV2Generate = Awaited<ReturnType<LanguageModelV2['doGenerate']>>;
//#endregion
//#region src/create-retryable-model.d.ts
/**
 * The context provided to Retryables with the current attempt and all previous attempts.
 */
interface RetryContext<CURRENT extends RetryAttempt = RetryAttempt> {
  current: CURRENT;
  attempts: Array<RetryAttempt>;
  totalAttempts: number;
}
type RetryErrorAttempt = {
  type: 'error';
  error: unknown;
  model: LanguageModelV2;
};
type RetryResultAttempt = {
  type: 'result';
  result: LanguageModelV2Generate;
  model: LanguageModelV2;
};
/**
 * A retry attempt with either an error or a result and the model used
 */
type RetryAttempt = RetryErrorAttempt | RetryResultAttempt;
/**
 * Type guard to check if a retry attempt is an error attempt
 */
declare function isErrorAttempt(attempt: RetryAttempt): attempt is RetryErrorAttempt;
/**
 * Type guard to check if a retry attempt is a result attempt
 */
declare function isResultAttempt(attempt: RetryAttempt): attempt is RetryResultAttempt;
/**
 * A model to retry with and the maximum number of attempts for that model.
 */
type RetryModel = {
  model: LanguageModelV2;
  maxAttempts?: number;
};
/**
 * A function that determines whether to retry with a different model based on the current attempt and all previous attempts.
 */
type Retryable = (context: RetryContext) => RetryModel | Promise<RetryModel> | undefined;
/**
 * Options for creating a retryable model.
 */
interface CreateRetryableOptions {
  model: LanguageModelV2;
  retries: Array<Retryable | LanguageModelV2>;
  onError?: (context: RetryContext<RetryErrorAttempt>) => void;
  onRetry?: (context: RetryContext<RetryErrorAttempt | RetryResultAttempt>) => void;
}
declare function createRetryable(config: CreateRetryableOptions): LanguageModelV2;
//#endregion
export { CreateRetryableOptions, RetryAttempt, RetryContext, RetryModel, Retryable, createRetryable, isErrorAttempt, isResultAttempt };
