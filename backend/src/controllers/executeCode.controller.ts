import { Response } from "express";
import { codeExecutionService, AppError } from "../services/index.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { validateInput } from "../services/validation.helper.js";
import {
  executeCodeSchemaWithValidation,
  ExecuteCodeInput,
} from "../middleware/validation.schema.js";
import { submissionService } from "../services/submission.service.js";

/**
 * Execute code against test cases (run mode only)
 */
export const executeCode = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const validatedData = validateInput<ExecuteCodeInput>(
      req.body,
      executeCodeSchemaWithValidation,
    );

    if (validatedData.mode === "submit") {
      // Submit mode: save to database with 'Processing' status and return immediately
      const { submission } = await codeExecutionService.submitCode(
        req.user.id,
        validatedData,
      );

      res.status(200).json({
        success: true,
        message: "Code submission received and is being processed",
        submissionId: submission.id,
        status: submission.status,
      });
      return;
    }

    // Run mode: just execute and return results
    const execution = await codeExecutionService.executeCode(
      req.user.id,
      validatedData,
    );

    res.status(200).json({
      success: true,
      message: "Code executed successfully",
      execution,
    });
  } catch (error) {
    handleExecutionError(error, res);
  }
};

/**
 * Get status of a specific submission
 */
export const getSubmissionStatus = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const submission = await submissionService.getSubmissionStatus(req.user.id, id);

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    handleExecutionError(error, res);
  }
};

/**
 * Centralized error handler for execution controller
 */
function handleExecutionError(error: any, res: Response): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    });
    return;
  }

  console.error("Unexpected error in execution controller:", error);
  res.status(500).json({
    error: "Failed to execute code",
  });
}
