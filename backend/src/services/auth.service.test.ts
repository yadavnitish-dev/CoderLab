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
vi.mock("../libs/db.js", () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    compare: vi.fn(),
  },
}));

vi.mock("../libs/jwt.util.js", () => ({
  generateToken: vi.fn().mockReturnValue("mock_token"),
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
});
