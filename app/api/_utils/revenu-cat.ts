const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY;
const REVENUECAT_API_URL = "https://api.revenuecat.com/v2";

const subscriptionCache = new Map<
  string,
  { status: boolean; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function checkUserSubscription(userId: string): Promise<boolean> {
  const cached = subscriptionCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.status;
  }

  try {
    const response = await fetch(
      `${REVENUECAT_API_URL}/subscribers/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${REVENUECAT_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error("RevenueCat API error:", response.statusText);
      return false;
    }

    const data = await response.json();

    // Check if user has any active entitlements
    const entitlements = data.subscriber?.entitlements || {};

    // Replace "pro" with your actual entitlement identifier
    const hasActiveSubscription = Object.keys(entitlements).some(
      (key) =>
        entitlements[key]?.expires_date === null ||
        new Date(entitlements[key]?.expires_date) > new Date(),
    );

    subscriptionCache.set(userId, {
      status: hasActiveSubscription,
      timestamp: Date.now(),
    });
    return hasActiveSubscription;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}
