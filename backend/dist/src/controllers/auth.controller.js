import { authService, AppError } from "../services/index.js";
import { validateInput } from "../services/validation.helper.js";
import { registerSchema, loginSchema, updateProfileSchema, updatePasswordSchema, } from "../middleware/validation.schema.js";
const setCookie = (res, token) => {
    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
};
export const register = async (req, res) => {
    try {
        const validatedData = validateInput(req.body, registerSchema);
        const result = await authService.register(validatedData);
        setCookie(res, result.token);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: result.user,
        });
    }
    catch (error) {
        handleAuthError(error, res);
    }
};
export const login = async (req, res) => {
    try {
        const validatedData = validateInput(req.body, loginSchema);
        const result = await authService.login(validatedData);
        setCookie(res, result.token);
        res.status(200).json({
            success: true,
            message: "User Logged In successfully",
            user: result.user,
        });
    }
    catch (error) {
        handleAuthError(error, res);
    }
};
export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });
        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    }
    catch (error) {
        handleAuthError(error, res);
    }
};
export const check = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        res.status(200).json({
            success: true,
            user: req.user,
        });
    }
    catch (error) {
        handleAuthError(error, res);
    }
};
export const updateProfile = async (req, res) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const validatedData = validateInput(req.body, updateProfileSchema);
        const user = await authService.updateProfile(req.user.id, validatedData);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    }
    catch (error) {
        handleAuthError(error, res);
    }
};
export const updatePassword = async (req, res) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const validatedData = validateInput(req.body, updatePasswordSchema);
        await authService.updatePassword(req.user.id, validatedData);
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch (error) {
        handleAuthError(error, res);
    }
};
/**
 * Centralized error handler for auth controller
 */
function handleAuthError(error, res) {
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
