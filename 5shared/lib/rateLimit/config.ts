import { TokenBucketConfig } from "./types";


export const RATE_LIMITS: Record<string, TokenBucketConfig> = {
  REGISTER: {
    capacity: 3,
    windowSeconds: 900, // 15 min
  },

  LOGIN: {
    capacity: 5,
    windowSeconds: 600, // 10 min
  },
};
