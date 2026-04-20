import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "./errors.js";

/**
 * Validation helper for services
 * Validates input against Zod schema and throws ValidationError if invalid
 */
export const validateInput = <T>(data: any, schema: ZodSchema): T => {
  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof ZodError || (error as any).name === "ZodError") {
      const issues = (error as any).issues || (error as any).errors || [];
      const formattedErrors = issues.map((err: any) => ({
        field: err.path.length > 0 ? err.path.join(".") : "root",
        message: err.message,
      }));

      throw new ValidationError(
        `Validation failed: ${formattedErrors.map((e: any) => `${e.field} - ${e.message}`).join("; ")}`,
      );
    }
    throw error;
  }
};
