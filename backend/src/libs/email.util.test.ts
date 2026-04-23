import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email.util.js";
import { Resend } from "resend";

const mockSend = vi.fn().mockResolvedValue({ data: { id: "mock-id" }, error: null });

vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(function() {
      return {
        emails: {
          send: mockSend,
        },
      };
    }),
  };
});

describe("email.util", () => {
  let emailUtils: any;

  beforeEach(async () => {
    vi.resetModules();
    process.env.RESEND_API_KEY = "re_valid_key";
    process.env.FRONTEND_URL = "http://localhost:3000";
    emailUtils = await import("./email.util.js");
  });

  it("should send verification email successfully", async () => {
    const result = await emailUtils.sendVerificationEmail("test@example.com", "token123");
    expect(result).toEqual({ id: "mock-id" });
  });

  it("should send password reset email successfully", async () => {
    const result = await emailUtils.sendPasswordResetEmail("test@example.com", "token123");
    expect(result).toEqual({ id: "mock-id" });
  });

  it("should return null if RESEND_API_KEY is missing", async () => {
    process.env.RESEND_API_KEY = "re_123456789"; // Default dummy key
    const result = await emailUtils.sendVerificationEmail("test@example.com", "token123");
    expect(result).toBeNull();
  });

  it("should throw error if resend returns an error", async () => {
    mockSend.mockResolvedValueOnce({ data: null, error: { message: "error" } });
    
    await expect(emailUtils.sendVerificationEmail("test@example.com", "token123")).rejects.toThrow();
  });
});
