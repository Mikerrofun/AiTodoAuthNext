import { TokenBucketConfig } from "./types";


export const RATE_LIMITS: Record<string, TokenBucketConfig> = {
  REGISTER: {
    capacity: 3,
    windowSeconds: 900, // 15 min
  },

  LOGIN_BY_IP: {
    capacity: 20,
    windowSeconds: 600, // 10 min
  },

  LOGIN_BY_ACCOUNT: {
    capacity: 5,
    windowSeconds: 600, // 10 min
  },
};
