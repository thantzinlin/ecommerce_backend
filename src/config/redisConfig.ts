// redisConfig.ts
import Redis from "ioredis";
import { config } from "../config";

export const redis = new Redis(config.redisUri, {
  reconnectOnError: (err) => err.message.includes("READONLY"),
  retryStrategy: (times) => Math.min(times * 50, 2000), // Retry strategy
});
