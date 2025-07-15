const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY;
const REVENUECAT_API_URL = "https://api.revenuecat.com/v2";
const DEFAULT_SERVINGS = 4;
const DEFAULT_USERNAME = "Chef";

const subscriptionCache = new Map<
  string,
  { status: boolean; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function checkUserSubscription(userId: string): Promise<boolean> {
  return false;
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

    console.log(response);

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

export async function POST(request: Request) {
  const headers = request.headers;
  const data = (await request.json()) as
    | { prompt: string; username: string }
    | undefined;
  const origin = headers.get("X-Origin");
  const vendorId = headers.get("X-Vendor-Id");
  const customerId = headers.get("X-Customer-Id");
  let isSubscribed = false;

  console.log(origin, vendorId, customerId);

  // vendor id
  // CBAD5FB9-C5E1-4641-AAE1-B257E2580A1B ;

  if (!origin || !vendorId) {
    return new Response("KO", { status: 401 });
  }

  if (origin !== process.env.EXPO_PUBLIC_ORIGIN_MOBILE) {
    return new Response("KO", { status: 401 });
  }

  if (customerId) {
    isSubscribed = await checkUserSubscription(customerId);
  }

  console.log("is sub ??");
  console.log(isSubscribed);

  if (!data?.prompt) {
    return new Response("KO", { status: 400 });
  }

  const arrayPrompt = data.prompt.split(",");

  if (arrayPrompt.length < 3) {
    return new Response("KO", { status: 400 });
  }

  // console.log(await getVendorRequestCount(vendorId));

  // if (await hasReachedRequestLimit(vendorId)) {
  // 	return new Response("Request limit reached", { status: 429 });
  // }

  const result = await generateRecipe(
    arrayPrompt,
    DEFAULT_SERVINGS,
    data.username || DEFAULT_USERNAME,
  );

  // await incrementVendorRequest(vendorId);
  // console.log("LOG");
  // console.log(result);

  return Response.json(JSON.parse(result));
}

const generateRecipe = (
  ingredients: string[],
  numberOfPeople: number,
  username: string,
) => {
  return generateRecipeWithOpenRouter(ingredients, numberOfPeople, username);
};

const generateRecipeWithOpenRouter = async (
  ingredients: string[],
  numberOfPeople: number,
  username: string,
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          // "HTTP-Referer": process.env.EXPO_PUBLIC_ORIGIN_MOBILE || "",
          // "X-Title": "Recipe Generator",
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct", // faster model
          messages: [
            {
              role: "system",
              content: `Crée une recette simple et original avec les ingrédients fournis. Réponds UNIQUEMENT en JSON:

{
  "presentation": "[Nom], voici votre recette:",
  "titleRecipe": "Titre original",
  "prepTime": "X minutes",
  "cookTime": "X minutes",
  "servings": X,
  "type": "Entrée/Plat/Dessert",
  "ingredients": ["ingrédient + quantité", "..."],
  "instructions": ["étape 1", "étape 2", "..."],
  "lexicon": [{"term": "terme technique", "definition": "explication simple"}],
  "footer": "Fridgy vous souhaite une excellente cuisine!"
}

Règles: français, vouvoyer, utiliser uniquement les ingrédients fournis à l'exception de certains ingrédients très communs dans une cuisine française (eau, poivre, huile, beurre...), pas de markdown. Ajoute au lexicon seulement les termes techniques peu communs imagine parler à une personne de 16 ans.`,
            },
            {
              role: "user",
              content: `La recette sera pour ${numberOfPeople} personne(s). Voici les ingrédients que l'utilisateur a indiqué : ${ingredients} et le nom de l'utilisateur est ${username}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout after 20 seconds");
    }
    throw error;
  }
};
