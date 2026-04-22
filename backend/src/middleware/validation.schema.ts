import { z } from "zod";

/**
 * Zod Validation Schemas for all API endpoints
 * Ensures type-safe input validation across the application
 */

// ============ AUTH SCHEMAS ============

export const registerSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .trim()
    .optional(),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

// ============ PROBLEM SCHEMAS ============

export const createProblemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .trim(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required").optional(),
  examples: z.array(z.object({ input: z.any(), output: z.any() })).min(1),
  constraints: z.string().min(5, "Constraints required").trim(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Test input required"),
        output: z.string().min(1, "Test output required"),
      }),
    )
    .min(1, "At least one test case required"),
  codeSnippets: z.record(z.string(), z.string()),
  referenceSolutions: z
    .record(z.string(), z.string())
    .refine(
      (obj) => Object.keys(obj).length > 0,
      "At least one reference solution required",
    ),
});

export const updateProblemSchema = createProblemSchema.partial();

// ============ PLAYLIST SCHEMAS ============

export const createPlaylistSchema = z.object({
  name: z.string().min(2, "Playlist name must be at least 2 characters").trim(),
  description: z.string().optional(),
});

export const addProblemsSchema = z.object({
  problemIds: z
    .array(z.string().uuid("Invalid problem ID format"))
    .min(1, "At least one problem ID required"),
});

export const removeProblemSchema = z.object({
  problemIds: z
    .array(z.string().uuid("Invalid problem ID format"))
    .min(1, "At least one problem ID required"),
});

// ============ CODE EXECUTION SCHEMAS ============

export const executeCodeSchema = z.object({
  problemId: z.string().uuid("Invalid problem ID format"),
  source_code: z.string().min(1, "Source code is required").max(100000, "Source code too long (max 100KB)"),
  language_id: z.number().int().positive("Valid language ID required"),
  stdin: z.array(z.string()).min(1, "At least one input required"),
  expected_outputs: z
    .array(z.string())
    .min(1, "At least one expected output required"),
  mode: z.enum(["run", "submit"]).default("run"),
});

// Add validation: stdin and expected_outputs must have same length
export const executeCodeSchemaWithValidation = executeCodeSchema.refine(
  (data) => data.stdin.length === data.expected_outputs.length,
  {
    message: "Number of inputs must match number of expected outputs",
    path: ["stdin"],
  },
);

// Export types for TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type CreateProblemInput = z.infer<typeof createProblemSchema>;
export type UpdateProblemInput = z.infer<typeof updateProblemSchema>;
export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>;
export type AddProblemsInput = z.infer<typeof addProblemsSchema>;
export type RemoveProblemInput = z.infer<typeof removeProblemSchema>;
export type ExecuteCodeInput = z.infer<typeof executeCodeSchemaWithValidation>;
