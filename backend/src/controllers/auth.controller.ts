import { Request, Response } from "express";
import { authService, AppError } from "../services/index.js";
import { setCookie, clearCookie } from "../libs/cookie.util.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { validateInput } from "../services/validation.helper.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
  UpdateProfileInput,
  UpdatePasswordInput,
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../middleware/validation.schema.js";


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = validateInput<RegisterInput>(
      req.body,
      registerSchema,
    );
    const result = await authService.register(validatedData);

    setCookie(res, result.token);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: result.user,
    });
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = validateInput<LoginInput>(req.body, loginSchema);
    const result = await authService.login(validatedData);

    setCookie(res, result.token);

    res.status(200).json({
      success: true,
      message: "User Logged In successfully",
      user: result.user,
    });
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    clearCookie(res);

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const check = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const validatedData = validateInput<UpdateProfileInput>(
      req.body,
      updateProfileSchema,
    );
    const user = await authService.updateProfile(req.user.id, validatedData);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const validatedData = validateInput<UpdatePasswordInput>(
      req.body,
      updatePasswordSchema,
    );
    await authService.updatePassword(req.user.id, validatedData);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = validateInput<VerifyEmailInput>(req.query, verifyEmailSchema);
    await authService.verifyEmail(token);

    res.status(200).json({
      success: true,
      message: "Email verified successfully. Access granted to execution nodes.",
    });
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const resendVerification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await authService.resendVerification(req.user.id);

    res.status(200).json({
      success: true,
      message: "A new verification link has been dispatched to your terminal.",
    });
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = validateInput<ForgotPasswordInput>(req.body, forgotPasswordSchema);
    await authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: "If an account exists, a recovery link has been dispatched.",
    });
  } catch (error) {
    handleAuthError(error, res);
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = validateInput<ResetPasswordInput>(req.body, resetPasswordSchema);
    await authService.resetPassword(validatedData);

    res.status(200).json({
      success: true,
      message: "Password reset complete. Protocol updated.",
    });
  } catch (error) {
    handleAuthError(error, res);
  }
};

/**
 * Centralized error handler for auth controller
 */
function handleAuthError(error: any, res: Response): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    });
    return;
  }

  console.error("Unexpected error in auth controller:", error);
  res.status(500).json({
    error: "Internal server error",
  });
}
