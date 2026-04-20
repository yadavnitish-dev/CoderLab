import { z, ZodError } from "zod";
import { ValidationError } from "../services/errors.js";
/**
 * Middleware factory for request body validation using Zod schemas
 * Validates incoming request body against provided schema
 * Throws ValidationError if validation fails
 */
export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            // Parse and validate the request body
            const validatedData = schema.parse(req.body);
            // Replace req.body with validated data to ensure clean input
            req.body = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof ZodError || error.name === "ZodError") {
                const issues = error.issues || error.errors || [];
                // Format Zod errors to be more user-friendly
                const formattedErrors = issues.map((err) => ({
                    field: err.path.length > 0 ? err.path.join(".") : "root",
                    message: err.message,
                }));
                const errorMessage = `Validation failed: ${formattedErrors.map((e) => `${e.field} - ${e.message}`).join("; ")}`;
                console.log("Passing validation error to error handler:", errorMessage);
                return next(new ValidationError(errorMessage));
            }
            return next(error);
        }
    };
};
/**
 * Middleware to validate and sanitize query parameters
 */
export const validatePaginationQuery = (req, res, next) => {
    try {
        const schema = z.object({
            page: z.coerce.number().int().positive().default(1),
            limit: z.coerce.number().int().positive().max(100).default(20),
        });
        const validatedQuery = schema.parse(req.query);
        req.query = validatedQuery;
        next();
    }
    catch (error) {
        if (error instanceof ZodError || error.name === "ZodError") {
            return next(new ValidationError("Invalid pagination parameters"));
        }
        next(error);
    }
};
/**
 * Middleware to validate UUID parameters in URL
 */
export const validateUUIDParam = (paramName) => {
    return (req, res, next) => {
        try {
            const schema = z.object({
                [paramName]: z.string().uuid(`Invalid ${paramName} format`),
            });
            schema.parse(req.params);
            next();
        }
        catch (error) {
            if (error instanceof ZodError || error.name === "ZodError") {
                const issues = error.issues || error.errors || [];
                return next(new ValidationError(issues[0]?.message || "Invalid parameter"));
            }
            next(error);
        }
    };
};
/**
 * Middleware to sanitize string inputs and prevent common injection attacks
 */
export const sanitizeInputs = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === "string") {
            // Remove potentially dangerous characters
            return obj
                .replace(/[<>]/g, "") // Remove HTML tags
                .trim();
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        if (obj !== null && typeof obj === "object") {
            return Object.keys(obj).reduce((acc, key) => {
                acc[key] = sanitize(obj[key]);
                return acc;
            }, {});
        }
        return obj;
    };
    req.body = sanitize(req.body);
    next();
};
