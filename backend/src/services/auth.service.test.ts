import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "./auth.service.js";
import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import { 
  ConflictError, 
  UnauthorizedError, 
  ValidationError 
} from "./errors.js";

// Mock the database and bcrypt
vi.mock("../libs/db.js", () => {
  const mockDb = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findFirst: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(mockDb)),
  };
  return { db: mockDb };
});

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    compare: vi.fn(),
  },
}));

vi.mock("../libs/jwt.util.js", () => ({
  generateToken: vi.fn().mockReturnValue("mock_token"),
  generateRefreshToken: vi.fn().mockReturnValue("mock_refresh_token"),
  verifyToken: vi.fn().mockReturnValue({ id: "mock_id" }),
}));

vi.mock("../libs/email.util.js", () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(true),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(true),
}));

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    const validRegistration = {
      email: "new@example.com",
      password: "Password123!",
      name: "Test User",
    };

    it("should register a new user successfully", async () => {
      (db.user.findUnique as any).mockResolvedValue(null);
      (db.user.create as any).mockResolvedValue({
        id: "user-1",
        ...validRegistration,
        role: "USER",
        isVerified: false,
      });
      (db.user.update as any).mockResolvedValue({
        id: "user-1",
        ...validRegistration,
        role: "USER",
        isVerified: false,
      });

      const result = await authService.register(validRegistration);

      expect(result.user.email).toBe(validRegistration.email);
      expect(result.token).toBe("mock_token");
      expect(db.user.create).toHaveBeenCalled();
    });

    it("should throw ConflictError if user already exists", async () => {
      (db.user.findUnique as any).mockResolvedValue({ id: "user-1" });

      await expect(authService.register(validRegistration))
        .rejects.toThrow(ConflictError);
    });

    it("should throw ValidationError if password is too simple", async () => {
      const weakRegistration = { ...validRegistration, password: "123" };
      
      await expect(authService.register(weakRegistration))
        .rejects.toThrow(ValidationError);
    });
  });

  describe("login", () => {
    const loginData = { email: "test@example.com", password: "Password123!" };

    it("should login successfully with correct credentials", async () => {
      (db.user.findUnique as any).mockResolvedValue({
        id: "user-1",
        email: loginData.email,
        password: "hashed_password",
      });
      (bcrypt.compare as any).mockResolvedValue(true);

      const result = await authService.login(loginData);

      expect(result.user.id).toBe("user-1");
      expect(result.token).toBe("mock_token");
    });

    it("should throw UnauthorizedError with incorrect password", async () => {
      (db.user.findUnique as any).mockResolvedValue({
        id: "user-1",
        password: "hashed_password",
      });
      (bcrypt.compare as any).mockResolvedValue(false);

      await expect(authService.login(loginData))
        .rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError if user does not have a password (social login)", async () => {
      (db.user.findUnique as any).mockResolvedValue({
        id: "user-1",
        password: null,
      });

      await expect(authService.login(loginData))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe("updatePassword", () => {
    const updateData = { oldPassword: "OldPassword123!", newPassword: "NewPassword123!" };

    it("should update password successfully", async () => {
      (db.user.findUnique as any).mockResolvedValue({
        id: "user-1",
        password: "hashed_old_password",
      });
      (bcrypt.compare as any).mockResolvedValue(true);

      await authService.updatePassword("user-1", updateData);

      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { password: "hashed_password" },
      });
    });

    it("should throw ValidationError if current password is wrong", async () => {
      (db.user.findUnique as any).mockResolvedValue({
        id: "user-1",
        password: "hashed_old_password",
      });
      (bcrypt.compare as any).mockResolvedValue(false);

      await expect(authService.updatePassword("user-1", updateData))
        .rejects.toThrow(ValidationError);
    });
    
    it("should enforce complex password rules for the new password", async () => {
        const weakUpdate = { ...updateData, newPassword: "weak" };
        (db.user.findUnique as any).mockResolvedValue({ id: "user-1", password: "hashed" });
        (bcrypt.compare as any).mockResolvedValue(true);

        // This should fail because 'weak' doesn't have Uppercase, Number, or Symbol
        await expect(authService.updatePassword("user-1", weakUpdate))
          .rejects.toThrow(ValidationError);
    });
  });

  describe("updateProfile", () => {
    it("should update profile successfully", async () => {
      const updateData = { name: "Updated Name" };
      (db.user.findUnique as any).mockResolvedValue({ id: "user-1" });
      (db.user.update as any).mockResolvedValue({ id: "user-1", name: updateData.name, email: "test@example.com" });

      const result = await authService.updateProfile("user-1", updateData);

      expect(result.name).toBe(updateData.name);
      expect(db.user.update).toHaveBeenCalled();
    });

    it("should throw NotFoundError if user not found", async () => {
      (db.user.findUnique as any).mockResolvedValue(null);
      await expect(authService.updateProfile("user-1", { name: "Name" }))
        .rejects.toThrow();
    });
  });

  describe("verifyEmail", () => {
    it("should verify email successfully with valid token", async () => {
      (db.user.findFirst as any).mockResolvedValue({ id: "user-1", email: "test@example.com" });
      (db.user.update as any).mockResolvedValue({ id: "user-1", isVerified: true, email: "test@example.com" });

      const result = await authService.verifyEmail("valid-token");

      expect(result.user.isVerified).toBe(true);
      expect(db.user.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ isVerified: true })
      }));
    });

    it("should throw ValidationError with invalid token", async () => {
      (db.user.findFirst as any).mockResolvedValue(null);
      await expect(authService.verifyEmail("invalid-token"))
        .rejects.toThrow(ValidationError);
    });
  });

  describe("resendVerification", () => {
    it("should resend verification email", async () => {
      (db.user.findUnique as any).mockResolvedValue({ id: "user-1", isVerified: false, email: "test@example.com" });

      await authService.resendVerification("user-1");

      expect(db.user.update).toHaveBeenCalled();
    });

    it("should throw ValidationError if already verified", async () => {
      (db.user.findUnique as any).mockResolvedValue({ id: "user-1", isVerified: true });
      await expect(authService.resendVerification("user-1"))
        .rejects.toThrow(ValidationError);
    });
  });

  describe("forgotPassword", () => {
    it("should process forgot password request", async () => {
      (db.user.findUnique as any).mockResolvedValue({ id: "user-1", email: "test@example.com", password: "hashed" });

      await authService.forgotPassword("test@example.com");

      expect(db.user.update).toHaveBeenCalled();
    });

    it("should return silently if user not found (security)", async () => {
      (db.user.findUnique as any).mockResolvedValue(null);
      await authService.forgotPassword("nonexistent@example.com");
      expect(db.user.update).not.toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    it("should reset password with valid token", async () => {
      (db.user.findFirst as any).mockResolvedValue({ id: "user-1" });

      await authService.resetPassword({ token: "token", password: "NewPassword123!" });

      expect(db.user.update).toHaveBeenCalled();
    });

    it("should throw ValidationError with invalid token", async () => {
      (db.user.findFirst as any).mockResolvedValue(null);
      await expect(authService.resetPassword({ token: "token", password: "NewPassword123!" }))
        .rejects.toThrow(ValidationError);
    });
  });

  describe("deleteAccount", () => {
    it("should delete account successfully", async () => {
      (db.user.findUnique as any).mockResolvedValue({ id: "user-1" });

      await authService.deleteAccount("user-1");

      expect(db.user.delete).toHaveBeenCalledWith({ where: { id: "user-1" } });
    });

    it("should throw NotFoundError if user not found", async () => {
      (db.user.findUnique as any).mockResolvedValue(null);
      await expect(authService.deleteAccount("user-1")).rejects.toThrow();
    });
  });

  describe("refreshToken", () => {
    it("should rotate tokens successfully", async () => {
      const mockUser = {
        id: "user-1",
        refreshToken: "valid-refresh-token",
        refreshTokenExpiry: new Date(Date.now() + 10000),
      };
      (db.user.findUnique as any).mockResolvedValue(mockUser);
      
      const result = await authService.refreshToken("valid-refresh-token");

      expect(result.token).toBe("mock_token");
      expect(result.refreshToken).toBe("mock_refresh_token");
      expect(db.user.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "user-1" },
        data: expect.objectContaining({ refreshToken: "mock_refresh_token" })
      }));
    });

    it("should throw UnauthorizedError if token does not match DB", async () => {
      (db.user.findUnique as any).mockResolvedValue({
        id: "user-1",
        refreshToken: "different-token",
      });

      await expect(authService.refreshToken("valid-refresh-token"))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe("revokeRefreshToken", () => {
    it("should clear refresh token in DB", async () => {
      await authService.revokeRefreshToken("user-1");

      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { refreshToken: null, refreshTokenExpiry: null },
      });
    });
  });
});
