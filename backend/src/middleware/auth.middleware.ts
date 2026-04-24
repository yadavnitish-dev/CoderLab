import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db } from "../libs/db.js";
import { cacheManager } from "../libs/redis.lib.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      isVerified?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    }
  }
}

// Since we're using Passport's global augmentation, 
// we can use the standard Request type.
export type AuthenticatedRequest = Request;

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    let decoded: JwtPayload | string;

    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        message: "Unauthorized- Invalid token",
      });
    }

    if (typeof decoded !== "object" || !("id" in decoded)) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token structure",
      });
    }

    const userId = (decoded as JwtPayload).id;
    
    // Cache user profile for 5 minutes to avoid DB hit on every request
    const user = await cacheManager.getOrSet(
      `user:profile:${userId}`,
      async () => {
        return db.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      },
      300 // 5 minutes TTL
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch {
    return res.status(500).json({
      message: "Error authenticating user",
    });
  }
};

export const checkAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access Denied: Admins only",
      });
    }

    next();
  } catch {
    res.status(500).json({
      message: "Error checking admin role",
    });
  }
};
