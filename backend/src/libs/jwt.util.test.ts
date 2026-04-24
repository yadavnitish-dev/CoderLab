import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateToken, generateRefreshToken, verifyToken } from "./jwt.util.js";
import jwt from "jsonwebtoken";

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn().mockReturnValue("mock-token"),
    verify: vi.fn(),
  },
}));

describe("jwt.util", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("should generate a token for a given userId", () => {
    const token = generateToken("user-1");

    expect(token).toBe("mock-token");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "user-1" },
      "test-secret",
      { expiresIn: "15m" }
    );
  });

  it("should generate a refresh token with 7d expiry", () => {
    const token = generateRefreshToken("user-1");

    expect(token).toBe("mock-token");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "user-1" },
      "test-secret",
      { expiresIn: "7d" }
    );
  });

  it("should use JWT_REFRESH_SECRET for refresh tokens if defined", () => {
    process.env.JWT_REFRESH_SECRET = "refresh-secret";
    generateRefreshToken("user-1");
    expect(jwt.sign).toHaveBeenCalledWith(
      expect.anything(),
      "refresh-secret",
      expect.anything()
    );
  });

  it("should verify a token correctly", () => {
    (jwt.verify as any).mockReturnValue({ id: "user-1" });
    const decoded = verifyToken("valid-token");

    expect(decoded.id).toBe("user-1");
    expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
  });

  it("should use refresh secret when verifyToken is called with isRefresh: true", () => {
    process.env.JWT_REFRESH_SECRET = "refresh-secret";
    (jwt.verify as any).mockReturnValue({ id: "user-1" });
    
    verifyToken("valid-token", true);
    
    expect(jwt.verify).toHaveBeenCalledWith("valid-token", "refresh-secret");
  });
});
