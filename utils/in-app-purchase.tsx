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
 * purchases a subscription package
 * @param identifier the name of the identifier attributed by revenuecat (ex: "$rc_monthly" or could be the identifier or entitlement ?)
 * @returns customer info object if purchase is successful, null if error occurs
 */
export const purchaseSubscription = async (identifier: string) => {
  try {
    // Get available packages
    const offerings = await Purchases.getOfferings();
    
    if (!offerings.current) {
      console.error('No offerings available');
      return null;
    }
    
    // Find the package with the specified ID
    const targetPackage = offerings.current.availablePackages.find(
      pkg => pkg.identifier === identifier
    );
    
    if (!targetPackage) {
      console.error(`Package with ID ${identifier} not found`);
      return null;
    }
    
    // Purchase the package
    const { customerInfo } = await Purchases.purchasePackage(targetPackage);
    
    return customerInfo;
  } catch (error: any) {
    // Handle user cancellation separately from other errors
    if (error.userCancelled) {
      console.log('User cancelled the purchase');
    } else {
      console.error('Error purchasing subscription:', error);
    }
    return null;
  }
};


