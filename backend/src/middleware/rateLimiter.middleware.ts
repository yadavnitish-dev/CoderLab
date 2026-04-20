import rateLimit from "express-rate-limit";
import { Response, Request, NextFunction } from "express";

/**
 * Rate Limiting Configuration
 * Prevents abuse and DoS attacks by limiting requests per IP
 */

/**
 * Helper function to normalize IP addresses for rate limiting
 * Handles IPv6, IPv4-mapped IPv6, and proxy headers
 */
const getClientIp = (req: Request): string => {
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  // Normalize IPv4-mapped IPv6 addresses
  return ip.startsWith("::ffff:") ? ip.substring(7) : ip;
};

// ============ GLOBAL RATE LIMITERS ============

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks on login/register
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: "Too many authentication attempts. Please try again later.",
  standardHeaders: true, // Return rate limit info in Response headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  keyGenerator: getClientIp,
  validate: { default: false },
  skip: (req: Request) => {
    // Don't rate limit logout (it's safe)
    return req.path === "/logout";
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many requests",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

/**
 * Moderate rate limiter for general API endpoints
 * Standard protection for most endpoints
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests from this IP. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  validate: { default: false },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many requests",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

/**
 * Strict rate limiter for code execution
 * Prevents abuse of expensive computation
 */
export const codeExecutionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 executions per minute
  message:
    "Too many code execution requests. Please wait before submitting again.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  validate: { default: false },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many code execution requests",
      code: "CODE_EXECUTION_RATE_LIMIT",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

/**
 * Very strict rate limiter for password changes
 * Prevents account takeover attempts
 */
export const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: "Too many password change attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  validate: { default: false },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many password change attempts",
      code: "PASSWORD_CHANGE_RATE_LIMIT",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

/**
 * IP Whitelist middleware for admin operations
 * Can be used to restrict operations to specific IPs if needed
 */
export const ipWhitelist = (allowedIPs: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (allowedIPs.length === 0) {
      // If no IPs specified, allow all
      return next();
    }

    const clientIP = req.ip ?? "";
    if (allowedIPs.includes(clientIP)) {
      next();
    } else {
      res.status(403).json({
        error: "Access denied",
        code: "IP_BLOCKED",
      });
    }
  };
};

/**
 * Custom middleware to enforce strict global rate limiting
 * Can be applied globally to all routes
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  validate: { default: false },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many requests",
      code: "GLOBAL_RATE_LIMIT_EXCEEDED",
    });
  },
});
