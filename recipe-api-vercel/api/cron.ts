import { VercelRequest } from "@vercel/node";

export async function GET(req: VercelRequest) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("KO", { status: 401 });
  }

  // Ping recipe endpoint to keep it warm
  try {
    await fetch(
      `${process.env.VERCEL_URL || "https://recipe-api-xi-liard.vercel.app"}/api/recipe?warmup=true`,
    );
  } catch (error) {
    console.log("Warmup ping failed:", error);
  }

  return new Response("OK", { status: 200 });
}
