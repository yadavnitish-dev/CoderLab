import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "../libs/db.js";
import { generateToken } from "../libs/jwt.util.js";
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
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
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
      throw new ConflictError("User already exists with this email");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedInput.password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const newUser = await db.user.create({
      data: {
        email: validatedInput.email,
        password: hashedPassword,
        name: validatedInput.name,
        role: UserRole.USER,
        verificationToken,
        verificationTokenExpires,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(newUser.email, verificationToken);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // We don't throw here to allow the user to registered, they can resend later
    }

    // Generate token
    const token = generateToken(newUser.id);

    return {
      user: this.formatUserResponse(newUser),
      token,
    };
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

    // Generate token
    const token = generateToken(user.id);

    return {
      user: this.formatUserResponse(user),
      token,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ): Promise<UserResponse> {
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

    return this.formatUserResponse(updatedUser);
  }

  /**
   * Update user password
   */
  async updatePassword(
    userId: string,
    input: UpdatePasswordInput
  ): Promise<void> {
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
  }): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      isVerified: user.isVerified || false,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
