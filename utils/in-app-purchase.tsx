import Purchases from "react-native-purchases";


/**
 * fetches customer information from RevenueCat
 * @returns customer info object or null if error occurs
 */
export const getCustomerInfo = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Error fetching customer info:', error);
    return null;
  }
};

/**
 * checks if the customer is subscribed to any active entitlement
 * @param entitlementId optional specific entitlement to check for
 * @returns boolean indicating if user has an active subscription
 */
export const isUserSubscribed = async (entitlementId?: string) => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    
    // If a specific entitlement ID is provided, check for that one
    if (entitlementId) {
      return customerInfo.entitlements.active[entitlementId] !== undefined;
    }
    
    // Otherwise check if the user has any active entitlements
    return Object.keys(customerInfo.entitlements.active).length > 0;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};


