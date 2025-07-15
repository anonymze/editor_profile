import { VercelRequest, VercelResponse } from "@vercel/node";

const REVENUECAT_API_URL = "https://api.revenuecat.com/v2";
const DEFAULT_SERVINGS = 4;
const DEFAULT_USERNAME = "Chef";

const subscriptionCache = new Map<
  string,
  { status: boolean; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle warmup ping
  if (req.query.warmup === "true") {
    console.log("warmup");
    return res.status(200).json({ status: "warm" });
  }

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Origin, X-Vendor-Id, X-Customer-Id",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body as { prompt: string; username: string } | undefined;
    const origin = req.headers["x-origin"] as string;
    const vendorId = req.headers["x-vendor-id"] as string;
    const customerId = req.headers["x-customer-id"] as string;
    let isSubscribed = false;

    console.log(origin, vendorId, customerId);

    if (!origin || !vendorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (origin !== process.env.EXPO_PUBLIC_ORIGIN_MOBILE) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (customerId) {
      isSubscribed = await checkUserSubscription(customerId);
    }

    console.log("is sub ??");
    console.log(isSubscribed);

    if (!data?.prompt) {
      return res.status(400).json({ error: "Bad Request" });
    }

    const arrayPrompt = data.prompt.split(",");

    if (arrayPrompt.length < 3) {
      return res.status(400).json({ error: "Bad Request" });
    }

    const result = await generateRecipe(
      arrayPrompt,
      DEFAULT_SERVINGS,
      data.username || DEFAULT_USERNAME,
    );

    return res.status(200).json(JSON.parse(result));
  } catch (error) {
    console.error("Error in POST handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
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
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          // model: "mistralai/mistral-7b-instruct",
          model: "mistralai/mistral-large-2411",
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
    // @ts-ignore
    return data.choices[0].message.content;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout after 20 seconds");
    }
    throw error;
  }
};

export async function checkUserSubscription(userId: string): Promise<boolean> {
  const cached = subscriptionCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.status;
  }

  return false;

  try {
    const response = await fetch(
      `${REVENUECAT_API_URL}/subscribers/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.REVENUECAT_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error("RevenueCat API error:", response.statusText);
      return false;
    }

    const data = await response.json();

    // @ts-ignore
    const entitlements = data?.subscriber?.entitlements || {};

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
