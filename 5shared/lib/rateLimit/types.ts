/* Configuration for Token Bucket rate limiting */
export interface TokenBucketConfig {
  capacity: number;
  windowSeconds: number;
}

/* Data structure stored in Redis for each bucket */
export interface BucketData {
  tokens: number;
  lastRefill: number;
}
