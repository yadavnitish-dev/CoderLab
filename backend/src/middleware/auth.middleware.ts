import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db } from "../libs/db.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
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
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized- Invalid token",
      });
    }

    if (typeof decoded !== "object" || !("id" in decoded)) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token structure",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: (decoded as JwtPayload).id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error authenticating user:", error);
    return res.status(500).json({
      message: "Error authenticating user",
    });
  }
};

export const checkAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Acess Denied : Admins only",
      });
    }

    next();
  } catch (error) {
    console.log("Error checking admin role:", error);
    res.status(500).json({
      message: "Error checking admin role",
    });
  }
};