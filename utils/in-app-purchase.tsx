import Purchases, { CustomerInfo, PurchasesOfferings } from "react-native-purchases";
import { PurchasesError } from "react-native-purchases";


/**
 * IN REVENUE CAT
 * YOU NEED TO HAVE AN ENTITLEMENT THAT HAS PRODUCTS
 * YOU NEED TO HAVE OFFERINGS THAT HAS PRODUCTS
 *
 * THE PRODUCTS NEED TO BE ASSOCIATED TO THE PRODUCTS ON EACH STORE (apple, android ..., you can import them on revenue cat -> products)
 *
 * ANDOIRD: NAME IS DEFINED OF THE SUBSCRIPTION SHOWED TO THE USER WILL BE THE ONE CREATED IN PRODUCTS -> SUBSCRIPTIONS
 * APPLE: NAME IS DEFINED ON SUBSCRIPTIONS -> GROUP OF SUBSCRIPTIONS -> SUBSCRIPTIONS -> LANGUAGE
 *
 * ANDROID: DESCRIPTION IS DEFINED ON SUBSCRIPTIONS DETAILS NEXT TO BENEFITS
 * APPLE: DESCRIPTION IS DEFINED ON SUBSCRIPTIONS -> GROUP OF SUBSCRIPTIONS -> SUBSCRIPTIONS -> LANGUAGE
 *
 * APPLE: YOU CAN SET THE NAME OF THE GROUP SUBSCRIPTION THAT WILL SEE THE USER INSIDE HIS MANAGEMENT SUBSCRIPTIONS
 * SUBSCRIPTIONS -> GROUP OF SUBSCRIPTIONS -> LANGUAGE
 */

export const isPurchasesError = (error: unknown): error is PurchasesError => {
	return (
		error !== null &&
		typeof error === "object" &&
		"code" in error &&
		"message" in error &&
		"underlyingErrorMessage" in error
	);
};

/**
 *
 * managementURL is the url where the customer can handle his subscription *
 */
export const getCustomerAppStore = async () => {
	try {
		return await Purchases.getCustomerInfo();
	} catch (error) {
		return null;
	}
};

/**
 * offerings?.current?.monthly?.identifier to get the identifier of the subscription (monthly here)
 */
export const getOfferingsAppStore = async () => {
	try {
		return await Purchases.getOfferings();
	} catch (error) {
		return null;
	}
};

/**
 * activeSubscriptions return the names of the subscriptions that has the customer (on android `${id of subscription}:{id base plan}`)
 *
 */
export const customerAppStoreHasSubscriptions = (customerInfo: CustomerInfo | null) => {
	return customerInfo && customerInfo.activeSubscriptions.length > 0;
};

export const purchaseFirstSubscriptionAvailable = async (offerings?: PurchasesOfferings) => {
	const offeringsInfo = offerings || (await getOfferingsAppStore());

	try {
		if (!offeringsInfo?.current) throw new Error("No offerings available");
		const firstOffering = offeringsInfo.current.availablePackages[0];
		return Purchases.purchasePackage(firstOffering);
	} catch (error: unknown) {
		console.log(error);
		if (isPurchasesError(error)) {
		}
		return undefined;
	}
};

export const purchaseSubscription = async (offeringIdentifier: string, offerings?: PurchasesOfferings) => {
	const offeringsInfo = offerings || (await getOfferingsAppStore());

	try {
		if (!offeringsInfo?.current) throw new Error("No offerings available");

		const offering = offeringsInfo.current.availablePackages.find(
			(pkg) => pkg.identifier === offeringIdentifier
		);

		if (!offering) throw new Error("Offering not found");

		return Purchases.purchasePackage(offering);
	} catch (error: unknown) {
		console.log(error);
		if (isPurchasesError(error)) {
		}
		return undefined;
	}
};

export const restorePurchases = async () => {
	try {
		return Purchases.restorePurchases();
	} catch (error: unknown) {
		console.log(error);
		if (isPurchasesError(error)) {
			// handle error
		}
		return undefined;
	}
};
