import { VercelRequest, VercelResponse } from "@vercel/node";


export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle warmup ping
  // if (req.query.warmup === "true") {
  //   return res.status(200).json({ status: "warm" });
  // }

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
    const data = req.body as { problem: string; username: string } | undefined;
    const origin = req.headers["x-origin"] as string;
    const vendorId = req.headers["x-vendor-id"] as string;
    const customerId = req.headers["x-customer-id"] as string;

    console.log(origin, vendorId, customerId);

    if (!origin || !vendorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (origin !== process.env.EXPO_PUBLIC_ORIGIN_MOBILE) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!data?.problem || !data.username) {
      return res.status(400).json({ error: "Bad Request" });
    }

    console.log(data.problem);
    console.log(data.username);

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
