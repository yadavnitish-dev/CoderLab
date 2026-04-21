import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware.js";

/**
 * Verified Middleware
 * Blocks access to sensitive algorithmic execution endpoints for unverified accounts
 */
export const isVerified = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Allow admins and verified users
  if (req.user.role === "ADMIN" || (req.user as any).isVerified) {
    return next();
  }

  return res.status(403).json({
    error: "Verification Required",
    message: "Protocol Restricted: You must verify your identity to access live execution nodes.",
    code: "UNVERIFIED_ACCOUNT",
  });
};
