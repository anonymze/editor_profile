import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is a cron job request from Vercel
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const timestamp = new Date().toISOString();
    console.log(`Cron job executed at ${timestamp}`);
    
    // Ping the health endpoint to keep the function warm
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const healthResponse = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Vercel-Cron'
      }
    });

    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.statusText}`);
    }

    const healthData = await healthResponse.json();
    
    return res.status(200).json({
      success: true,
      timestamp,
      message: 'Cron job executed successfully',
      healthCheck: healthData
    });
    
  } catch (error) {
    console.error('Cron job error:', error);
    return res.status(500).json({
      success: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}