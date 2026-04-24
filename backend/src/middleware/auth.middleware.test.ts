import { describe, it, expect, vi, beforeEach } from "vitest";
import { authMiddleware, checkAdmin } from "./auth.middleware.js";
import { db } from "../libs/db.js";
import jwt from "jsonwebtoken";

vi.mock("../libs/db.js", () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("../libs/redis.lib.js", () => ({
  cacheManager: {
    getOrSet: vi.fn((key, cb) => cb()),
    invalidate: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

describe("Auth Middleware", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
    req = {
      cookies: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  describe("authMiddleware", () => {
    it("should return 401 if no token is provided", async () => {
      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining("No token provided"),
      }));
    });

    it("should return 401 if token is invalid", async () => {
      req.cookies.jwt = "invalid-token";
      (jwt.verify as any).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should call next() and set req.user if token is valid", async () => {
      req.cookies.jwt = "valid-token";
      const mockUser = { id: "user-1", email: "test@example.com" };
      (jwt.verify as any).mockReturnValue({ id: "user-1" });
      (db.user.findUnique as any).mockResolvedValue(mockUser);

      await authMiddleware(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("checkAdmin", () => {
    it("should return 403 if user is not an admin", async () => {
      req.user = { id: "user-1", role: "USER" };

      await checkAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should call next() if user is an admin", async () => {
      req.user = { id: "user-1", role: "ADMIN" };

      await checkAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
