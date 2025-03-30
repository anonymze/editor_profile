import { createClient } from 'redis';


if (!process.env.REDIS_URL) {
  throw new Error('redis url not found in environment variables');
}

const redisClient = createClient({
  url: process.env.REDIS_URL,
  // memcached doesn't need TLS
  socket: {
    tls: false
  }
});

redisClient.on('error', (err) => {
  console.error('redis client error:', err);
});

redisClient.on('connect', () => {
  console.log('connected to redis');
});

// connect immediately
redisClient.connect().catch(console.error);

export default redisClient; 