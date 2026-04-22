import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn(
    "⚠️ UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not defined. Redis caching will be disabled."
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * Cache Wrapper Utilities
 */
export const cacheManager = {
  /**
   * Get data from cache or fetch and set if missing
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds = 3600 // Default 1 hour
  ): Promise<T> {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return fetcher();
    }

    try {
      const cachedData = await redis.get<T>(key);
      if (cachedData) {
        return cachedData;
      }

      const freshData = await fetcher();
      await redis.set(key, freshData, { ex: ttlSeconds });
      return freshData;
    } catch (error) {
      // Structured logging for debugging without crashing the request
      console.error(`[Redis Cache Error] Key: ${key} | Message: ${(error as Error).message}`);
      return fetcher(); // Fallback to database
    }
  },

  /**
   * Invalidate a cache key
   */
  async invalidate(key: string): Promise<void> {
    if (!process.env.UPSTASH_REDIS_REST_URL) return;
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`Redis Invalidation Error (Key: ${key}):`, error);
    }
  },
};
