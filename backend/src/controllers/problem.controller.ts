import { Request, Response } from "express";
import { problemService, AppError } from "../services/index.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { validateInput } from "../services/validation.helper.js";
import {
  createProblemSchema,
  updateProblemSchema,
  CreateProblemInput,
  UpdateProblemInput,
} from "../middleware/validation.schema.js";
import { z } from "zod";

/**
 * Create a new problem with reference solution validation
 */
export const createProblem = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res
        .status(403)
        .json({ error: "You are not allowed to create a problem" });
      return;
    }

    const validatedData = validateInput<CreateProblemInput>(
      req.body,
      createProblemSchema,
    );
    const problem = await problemService.createProblem(
      req.user.id,
      validatedData,
    );

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem,
    });
  } catch (error) {
    handleProblemError(error, res);
  }
};

/**
 * Get all problems (paginated)
 */
export const getAllProblems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const paginationSchema = z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
    });

    const { page, limit } = validateInput<{ page: number; limit: number }>(
      req.query,
      paginationSchema,
    );

    const { problems, total, pages } = await problemService.getAllProblems(
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    });
  } catch (error) {
    handleProblemError(error, res);
  }
};

/**
 * Get a single problem by ID
 */
export const getProblemById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = validateInput<{ id: string }>(
      req.params,
      z.object({ id: z.string() }),
    );

    const problem = await problemService.getProblemById(id);

    res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem,
    });
  } catch (error) {
    handleProblemError(error, res);
  }
};

/**
 * Update an existing problem
 */
export const updateProblem = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res
        .status(403)
        .json({ error: "You are not allowed to update a problem" });
      return;
    }

    const { id } = validateInput<{ id: string }>(
      req.params,
      z.object({ id: z.string() }),
    );

    const validatedData = validateInput<UpdateProblemInput>(
      req.body,
      updateProblemSchema,
    );
    const problem = await problemService.updateProblem(
      id,
      req.user.id,
      validatedData,
    );

    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem,
    });
  } catch (error) {
    handleProblemError(error, res);
  }
};

/**
 * Delete a problem
 */
export const deleteProblem = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      res
        .status(403)
        .json({ error: "You are not allowed to delete a problem" });
      return;
    }

    const { id } = validateInput<{ id: string }>(
      req.params,
      z.object({ id: z.string() }),
    );

    await problemService.deleteProblem(id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    handleProblemError(error, res);
  }
};

/**
 * Get all problems solved by the authenticated user
 */
export const getAllProblemsSolvedByUser = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const problems = await problemService.getProblemsSolvedByUser(req.user.id);

    res.status(200).json({
      success: true,
      message: "Solved problems fetched successfully",
      problems,
    });
  } catch (error) {
    handleProblemError(error, res);
  }
};

/**
 * Centralized error handler for problem controller
 */
function handleProblemError(error: any, res: Response): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    });
    return;
  }

  console.error("Unexpected error in problem controller:", error);
  res.status(500).json({
    error: "Internal server error",
  });
}
