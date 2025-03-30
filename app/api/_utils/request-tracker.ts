import redisClient from './redis-client';


const REQUEST_COUNT_PREFIX = 'vendor:requests:';
const MAX_REQUESTS = 10;

export async function getVendorRequestCount(vendorId: string): Promise<number> {
  const key = `${REQUEST_COUNT_PREFIX}${vendorId}`;
  
  try {
    const count = await redisClient.get(key);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error('Error getting vendor request count:', error);
    return 0;
  }
}

export async function incrementVendorRequest(vendorId: string): Promise<number> {
  const key = `${REQUEST_COUNT_PREFIX}${vendorId}`;
  
  try {
    // increment the counter
    const count = await redisClient.incr(key);
    return count;
  } catch (error) {
    console.error('Error tracking vendor request:', error);
    return 0;
  }
}

export async function hasReachedRequestLimit(vendorId: string): Promise<boolean> {
  const count = await getVendorRequestCount(vendorId);
  return count >= MAX_REQUESTS;
}


