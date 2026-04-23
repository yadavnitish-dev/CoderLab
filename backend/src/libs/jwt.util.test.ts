import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateToken } from "./jwt.util.js";
import jwt from "jsonwebtoken";

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn().mockReturnValue("mock-token"),
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
      { expiresIn: "7d" }
    );
  });

  it("should throw error if JWT_SECRET is missing", () => {
    delete process.env.JWT_SECRET;
    expect(() => generateToken("user-1")).toThrow("JWT_SECRET is not defined");
  });
});
