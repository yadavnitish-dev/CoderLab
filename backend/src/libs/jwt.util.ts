import jwt from "jsonwebtoken";

/**
 * JWT Utility
 * Shared logic for token generation across auth methods
 */
export const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
