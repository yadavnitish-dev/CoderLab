import { ZodError } from "zod";
import { ValidationError } from "./errors.js";
/**
 * Validation helper for services
 * Validates input against Zod schema and throws ValidationError if invalid
 */
export const validateInput = (data, schema) => {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof ZodError || error.name === "ZodError") {
            const issues = error.issues || error.errors || [];
            const formattedErrors = issues.map((err) => ({
                field: err.path.length > 0 ? err.path.join(".") : "root",
                message: err.message,
            }));
            throw new ValidationError(`Validation failed: ${formattedErrors.map((e) => `${e.field} - ${e.message}`).join("; ")}`);
        }
        throw error;
    }
};
