import { VercelRequest, VercelResponse } from "@vercel/node";

export async function GET(req: VercelRequest, res: VercelResponse) {
  // @ts-ignore
  const authHeader = req.headers.get("authorization");

  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({ success: false });
  }

  // Ping recipe endpoint to keep it warm
  try {
    await fetch(
      "https://recipe-api-xi-liard.vercel.app/api/recipe?warmup=true",
    );
  } catch (error) {
    console.log("Warmup ping failed:", error);
  }

  return new Response("OK", { status: 200 });
}
