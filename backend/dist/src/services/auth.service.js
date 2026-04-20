import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import { ValidationError, NotFoundError, ConflictError, UnauthorizedError, } from "./errors.js";
import { validateInput } from "./validation.helper.js";
import { registerSchema, loginSchema, } from "../middleware/validation.schema.js";
/**
 * Authentication Service
 * Handles user registration, login, profile updates, and password management
 */
export class AuthService {
    /**
     * Register a new user
     */
    async register(input) {
        // Validate input using Zod schema
        const validatedInput = validateInput(input, registerSchema);
        // Check if user exists
        const existingUser = await db.user.findUnique({
            where: { email: validatedInput.email },
        });
        if (existingUser) {
            throw new ConflictError("User already exists with this email");
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(validatedInput.password, 10);
        // Create user
        const newUser = await db.user.create({
            data: {
                email: validatedInput.email,
                password: hashedPassword,
                name: validatedInput.name,
                role: UserRole.USER,
            },
        });
        // Generate token
        const token = this.generateToken(newUser.id);
        return {
            user: this.formatUserResponse(newUser),
            token,
        };
    }
    /**
     * Login an existing user
     */
    async login(input) {
        // Validate input using Zod schema
        const validatedInput = validateInput(input, loginSchema);
        // Find user
        const user = await db.user.findUnique({
            where: { email: validatedInput.email },
        });
        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }
        // Verify password
        const isMatch = await bcrypt.compare(validatedInput.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedError("Invalid credentials");
        }
        // Generate token
        const token = this.generateToken(user.id);
        return {
            user: this.formatUserResponse(user),
            token,
        };
    }
    /**
     * Update user profile
     */
    async updateProfile(userId, input) {
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
    async updatePassword(userId, input) {
        if (!userId) {
            throw new UnauthorizedError();
        }
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundError("User");
        }
        // Verify old password
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
     * Generate JWT token
     */
    generateToken(userId) {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
    }
    /**
     * Format user response
     */
    formatUserResponse(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
        };
    }
}
// Export singleton instance
export const authService = new AuthService();
