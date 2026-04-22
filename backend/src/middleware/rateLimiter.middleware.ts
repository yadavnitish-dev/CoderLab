import rateLimit from "express-rate-limit";
import { Response, Request, NextFunction } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../libs/redis.lib.js";

/**
 * Rate Limiting Configuration
 * Prevents abuse and DoS attacks by limiting requests per IP
 */

const isRedisEnabled = !!process.env.UPSTASH_REDIS_REST_URL;

// ============ UPSTASH RATE LIMITER HELPERS ============

interface Ratelimiters {
  auth: Ratelimit;
  general: Ratelimit;
  execution: Ratelimit;
  password: Ratelimit;
}

const upstashRatelimit = isRedisEnabled
  ? ({
      auth: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "15 m"),
        prefix: "ratelimit:auth",
      }),
      general: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "15 m"),
        prefix: "ratelimit:general",
      }),
      execution: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 m"),
        prefix: "ratelimit:execution",
      }),
      password: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, "1 h"),
        prefix: "ratelimit:password",
      }),
    } as Ratelimiters)
  : null;

/**
 * Higher order function to create rate limiters with Upstash fallback
 */
const createLimiter = (
  type: keyof Ratelimiters,
  fallbackLimiter: any
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!isRedisEnabled || !upstashRatelimit) {
      return fallbackLimiter(req, res, next);
    }

    const identifier = req.ip || "anonymous";
    const { success, limit, reset, remaining } = await upstashRatelimit[type].limit(
      identifier
    );

    res.setHeader("X-RateLimit-Limit", limit.toString());
    res.setHeader("X-RateLimit-Remaining", remaining.toString());
    res.setHeader("X-RateLimit-Reset", reset.toString());

    if (!success) {
      return res.status(429).json({
        error: "Too many requests",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: new Date(reset).toISOString(),
      });
    }

    next();
  };
};

// ============ FALLBACK IN-MEMORY LIMITERS ============

const memoryAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.ip || "unknown",
  validate: { default: false },
  handler: (req, res) => {
    res.status(429).json({ error: "Too many requests", code: "RATE_LIMIT_EXCEEDED" });
  },
});

const memoryGeneralLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  validate: { default: false },
  keyGenerator: (req) => req.ip || "unknown",
});

const memoryExecutionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  validate: { default: false },
  keyGenerator: (req) => req.ip || "unknown",
});

const memoryPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  validate: { default: false },
  keyGenerator: (req) => req.ip || "unknown",
});

// ============ EXPORTED MIDDLEWARES ============

export const authLimiter = createLimiter("auth", memoryAuthLimiter);
export const generalLimiter = createLimiter("general", memoryGeneralLimiter);
export const codeExecutionLimiter = createLimiter("execution", memoryExecutionLimiter);
export const passwordChangeLimiter = createLimiter("password", memoryPasswordLimiter);

/**
 * IP Whitelist middleware for admin operations
 */
export const ipWhitelist = (allowedIPs: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (allowedIPs.length === 0) return next();
    const clientIP = req.ip ?? "";
    if (allowedIPs.includes(clientIP)) {
      next();
    } else {
      res.status(403).json({ error: "Access denied", code: "IP_BLOCKED" });
    }
  };
};

/**
 * Simple global rate limiter (standard express-rate-limit is fine for this)
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { default: false },
});
