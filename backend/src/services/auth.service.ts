import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "../libs/db.js";
import { cacheManager } from "../libs/redis.lib.js";
import { generateToken, generateRefreshToken, verifyToken } from "../libs/jwt.util.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../libs/email.util.js";
import { UserRole } from "../generated/prisma/index.js";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from "./errors.js";
import { validateInput } from "./validation.helper.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
  type RegisterInput,
  type LoginInput,
  type UpdateProfileInput,
  type UpdatePasswordInput,
} from "../middleware/validation.schema.js";

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image: string | null;
  isVerified: boolean;
  isSocial: boolean;
  socialProvider: "google" | "github" | null;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
  refreshToken?: string;
}

/**
 * Authentication Service
 * Handles user registration, login, profile updates, and password management
 */
export class AuthService {
  /**
   * Register a new user
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    // Validate input using Zod schema
    const validatedInput = validateInput<RegisterInput>(input, registerSchema);

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedInput.email },
    });

    if (existingUser) {
      // For security, don't reveal if user exists. Return success but don't create.
      // In production, we should send an email to the existing user notifying them.
      return {
        user: this.formatUserResponse(existingUser),
        token: generateToken(existingUser.id),
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedInput.password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user and tokens in a transaction
    const result = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: validatedInput.email,
          password: hashedPassword,
          name: validatedInput.name,
          role: UserRole.USER,
          verificationToken,
          verificationTokenExpires,
        },
      });

      // Generate tokens
      const token = generateToken(newUser.id);
      const refreshToken = generateRefreshToken(newUser.id);
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Save refresh token
      const updatedUser = await tx.user.update({
        where: { id: newUser.id },
        data: {
          refreshToken,
          refreshTokenExpiry,
        },
      });

      return {
        user: this.formatUserResponse(updatedUser),
        token,
        refreshToken,
      };
    });

    // Send verification email outside transaction to avoid blocking
    try {
      await sendVerificationEmail(result.user.email, verificationToken);
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }

    return result;
  }

  /**
   * Login an existing user
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    // Validate input using Zod schema
    const validatedInput = validateInput<LoginInput>(input, loginSchema);

    // Find user
    const user = await db.user.findUnique({
      where: { email: validatedInput.email },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Verify password
    if (!user.password) {
      throw new UnauthorizedError("Please use social login or reset your password");
    }

    const isMatch = await bcrypt.compare(validatedInput.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Generate tokens
    const { token, refreshToken } = await this.generateAuthTokens(user.id);
    
    return {
      user: this.formatUserResponse(user),
      token,
      refreshToken,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ): Promise<UserResponse> {
    // Validate input
    validateInput<UpdateProfileInput>(
      input,
      updateProfileSchema,
    );

    if (!userId) {
      throw new UnauthorizedError();
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User");
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { name: input.name },
    });

    await cacheManager.invalidate(`user:profile:${userId}`);

    return this.formatUserResponse(updatedUser);
  }

  /**
   * Update user password
   */
  async updatePassword(
    userId: string,
    input: UpdatePasswordInput
  ): Promise<void> {
    // Validate input
    validateInput<UpdatePasswordInput>(input, updatePasswordSchema);

    if (!userId) {
      throw new UnauthorizedError();
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User");
    }

    // Verify old password
    if (!user.password) {
      throw new ValidationError("Account does not have a password set. Use social login.");
    }

    const isMatch = await bcrypt.compare(input.oldPassword, user.password);
    if (!isMatch) {
      throw new ValidationError("Incorrect current password");
    }

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(input.newPassword, 10);
    await db.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<AuthResponse> {
    const user = await db.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new ValidationError("Invalid or expired verification token");
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    await cacheManager.invalidate(`user:profile:${user.id}`);

    return {
      user: this.formatUserResponse(updatedUser),
      token: generateToken(updatedUser.id),
    };
  }

  /**
   * Resend verification email
   */
  async resendVerification(userId: string): Promise<void> {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User");
    if (user.isVerified) throw new ValidationError("Account already verified");

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.user.update({
      where: { id: userId },
      data: { verificationToken, verificationTokenExpires },
    });

    await sendVerificationEmail(user.email, verificationToken);
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await db.user.findUnique({ where: { email } });
    
    // For security, don't reveal if user exists
    if (!user || !user.password) return;

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires,
      },
    });

    await sendPasswordResetEmail(user.email, resetToken);
  }

  /**
   * Reset password using token
   */
  async resetPassword(input: { token: string; password: string }): Promise<void> {
    const user = await db.user.findFirst({
      where: {
        resetPasswordToken: input.token,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new ValidationError("Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }

  /**
   * Delete user account and all associated data
   */
  async deleteAccount(userId: string): Promise<void> {
    if (!userId) {
      throw new UnauthorizedError();
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User");
    }

    // Cascade delete is handled by Prisma schema (onDelete: Cascade)
    await db.user.delete({
      where: { id: userId },
    });

    await cacheManager.invalidate(`user:profile:${userId}`);
  }

  /**
   * Revoke refresh token (logout)
   */
  async revokeRefreshToken(userId: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
        refreshTokenExpiry: null,
      },
    });
  }

  /**
   * Refresh access token
   */
  async refreshToken(token: string): Promise<AuthResponse> {
    try {
      const decoded = verifyToken(token, true);
      const user = await db.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || !user.refreshToken || !user.refreshTokenExpiry || user.refreshTokenExpiry < new Date()) {
        throw new UnauthorizedError("Invalid or expired refresh token");
      }

      const isValid = await bcrypt.compare(token, user.refreshToken);
      if (!isValid) {
        throw new UnauthorizedError("Invalid refresh token");
      }

      // Generate new tokens (Rotation)
      const tokens = await this.generateAuthTokens(user.id);

      return {
        user: this.formatUserResponse(user),
        ...tokens,
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) throw error;
      throw new UnauthorizedError("Invalid refresh token");
    }
  }

  /**
   * Social Login (OAuth)
   */
  async loginSocial(user: any): Promise<AuthResponse> {
    const tokens = await this.generateAuthTokens(user.id);
    return {
      user: this.formatUserResponse(user),
      ...tokens,
    };
  }

  /**
   * Helper to generate and save auth tokens
   */
  async generateAuthTokens(userId: string): Promise<{ token: string; refreshToken: string }> {
    const token = generateToken(userId);
    const refreshToken = generateRefreshToken(userId);
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await db.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashedRefreshToken,
        refreshTokenExpiry,
      },
    });

    return { token, refreshToken };
  }

  /**
   * Format user response
   */
  private formatUserResponse(user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    image: string | null;
    isVerified: boolean;
    password?: string | null;
  }): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      isVerified: user.isVerified || false,
      isSocial: !user.password,
      socialProvider: (user as { googleId?: string }).googleId ? "google" : (user as { githubId?: string }).githubId ? "github" : null,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
