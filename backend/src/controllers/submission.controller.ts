import { Response } from "express";
import { submissionService, AppError } from "../services/index.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { validateInput } from "../services/validation.helper.js";
import { z } from "zod";

/**
 * Get all submissions for the authenticated user
 */
export const getAllSubmission = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const paginationSchema = z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
    });

    // Validate query parameters if any (optional for this specific route as per current service implementation)
    // but good to have for future proofing
    validateInput(req.query, paginationSchema);

    const submissions = await submissionService.getAllSubmissionsByUser(
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    handleSubmissionError(error, res);
  }
};

/**
 * Get submissions for a specific problem by the authenticated user
 */
export const getSubmissionsForProblem = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { problemId } = validateInput<{ problemId: string }>(
      req.params,
      z.object({ problemId: z.string().uuid("Invalid problem ID format") }),
    );

    const submissions = await submissionService.getSubmissionsForProblem(
      req.user.id,
      problemId,
    );

    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    handleSubmissionError(error, res);
  }
};

/**
 * Get total submission count for a problem
 */
export const getAllTheSubmissionsForProblem = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { problemId } = validateInput<{ problemId: string }>(
      req.params,
      z.object({ problemId: z.string().uuid("Invalid problem ID format") }),
    );

    const count =
      await submissionService.getSubmissionCountForProblem(problemId);

    res.status(200).json({
      success: true,
      message: "Submission count fetched successfully",
      count,
    });
  } catch (error) {
    handleSubmissionError(error, res);
  }
};

/**
 * Centralized error handler for submission controller
 */
function handleSubmissionError(error: any, res: Response): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    });
    return;
  }

  console.error("Unexpected error in submission controller:", error);
  res.status(500).json({
    error: "Internal server error",
  });
}
