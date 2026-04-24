import jwt from "jsonwebtoken";

/**
 * JWT Utility
 * Shared logic for token generation across auth methods
 */
/**
 * Generate Access Token (Short-lived)
 */
export const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

/**
 * Generate Refresh Token (Long-lived)
 */
export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET or JWT_REFRESH_SECRET is not defined");
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: "7d",
  });
};

/**
 * Verify Token
 */
export const verifyToken = (token: string, isRefresh = false): any => {
  const secret = isRefresh 
    ? (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    : process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, secret);
};
