import express from "express";
import {
  check,
  login,
  logout,
  register,
  updatePassword,
  updateProfile,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  deleteAccount,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { sanitizeInputs } from "../middleware/validation.middleware.js";
import {
  authLimiter,
  passwordChangeLimiter,
} from "../middleware/rateLimiter.middleware.js";
import oauthRoutes from "./oauth.route.js";

const authRoutes = express.Router();

// --- OAuth Routes ---
authRoutes.use("/", oauthRoutes);

authRoutes.post("/register", authLimiter, sanitizeInputs, register);

authRoutes.post("/login", authLimiter, sanitizeInputs, login);

authRoutes.post("/logout", authMiddleware, logout);

authRoutes.get("/check", authMiddleware, check);

authRoutes.put(
  "/update-profile",
  authMiddleware,
  sanitizeInputs,
  updateProfile,
);

authRoutes.put(
  "/update-password",
  authMiddleware,
  passwordChangeLimiter,
  sanitizeInputs,
  updatePassword,
);

// --- Auth Resilience Routes ---
authRoutes.get("/verify-email", verifyEmail);
authRoutes.post("/resend-verification", authMiddleware, resendVerification);
authRoutes.post("/forgot-password", sanitizeInputs, forgotPassword);
authRoutes.post("/reset-password", sanitizeInputs, resetPassword);

authRoutes.delete("/delete-account", authMiddleware, deleteAccount);

export default authRoutes;
