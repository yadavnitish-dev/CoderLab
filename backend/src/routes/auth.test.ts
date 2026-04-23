import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../index.js";
import { db } from "../libs/db.js";
import jwt from "jsonwebtoken";

// Mock dependencies
vi.mock("../libs/db.js");
vi.mock("jsonwebtoken");

describe("Auth Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/auth/check", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/api/v1/auth/check");
      expect(res.status).toBe(401);
    });

    it("should return 200 and user data if valid token is provided", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "USER",
        isVerified: true,
        updatedAt: new Date(),
      };

      // Mock JWT verify to return the user ID
      (jwt.verify as any).mockReturnValue({ id: "user-123" });
      
      // Mock DB to return the user
      (db.user.findUnique as any).mockResolvedValue(mockUser);

      const res = await request(app)
        .get("/api/v1/auth/check")
        .set("Cookie", ["jwt=valid-token"]);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe("test@example.com");
      expect(res.body.success).toBe(true);
    });

    it("should return 401 if token is malformed", async () => {
      (jwt.verify as any).mockImplementation(() => {
        throw new Error("JsonWebTokenError");
      });

      const res = await request(app)
        .get("/api/v1/auth/check")
        .set("Cookie", ["jwt=bad-token"]);

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user", async () => {
      (db.user.findUnique as any).mockResolvedValue(null);
      (db.user.create as any).mockResolvedValue({ id: "1", email: "new@example.com", name: "New" });

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: "new@example.com", password: "Password123!", name: "New" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login a user", async () => {
      (db.user.findUnique as any).mockResolvedValue({ id: "1", email: "test@example.com", password: "hashed" });
      const bcrypt = await import("bcryptjs");
      // @ts-ignore
      vi.spyOn(bcrypt.default, "compare").mockResolvedValue(true);

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "test@example.com", password: "password" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should logout a user", async () => {
      (jwt.verify as any).mockReturnValue({ id: "user-123" });
      (db.user.findUnique as any).mockResolvedValue({ id: "user-123" });

      const res = await request(app)
        .post("/api/v1/auth/logout")
        .set("Cookie", ["jwt=valid-token"]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
