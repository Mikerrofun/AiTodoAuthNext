import { redis } from "@/5shared/lib/redis/redis";
import { TokenBucketConfig, BucketData } from "./types";

/**
 * 
 * @param key - Unique identifier for the bucket (e.g., "ratelimit:register:192.168.1.1:john_doe")
 * @param config - Token bucket configuration (capacity and time window)
 * @returns true if request is allowed, false if rate limit exceeded
 */
export async function checkTokenBucket(
  key: string,
  config: TokenBucketConfig
): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const refillRate = config.capacity / config.windowSeconds;

  const existingData = await redis.get<BucketData>(key);

  let tokens: number;
  let lastRefill: number;

  if (!existingData) {
    tokens = config.capacity;
    lastRefill = now;
  } else {

    // Calculate tokens refilled since last access
    const elapsed = now - existingData.lastRefill;
    const newTokens = elapsed * refillRate;
    
    tokens = Math.min(config.capacity, existingData.tokens + newTokens);
    lastRefill = now;
  }

  if (tokens < 1) return false;

  tokens -= 1;

  const bucketData: BucketData = {
    tokens,
    lastRefill,
  };

  await redis.setex(key, config.windowSeconds, JSON.stringify(bucketData));

  return true;
}
