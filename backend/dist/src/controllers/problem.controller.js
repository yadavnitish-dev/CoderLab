import { problemService, AppError } from "../services/index.js";
import { validateInput } from "../services/validation.helper.js";
import { createProblemSchema, updateProblemSchema, } from "../middleware/validation.schema.js";
import { z } from "zod";
/**
 * Create a new problem with reference solution validation
 */
export const createProblem = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            res
                .status(403)
                .json({ error: "You are not allowed to create a problem" });
            return;
        }
        const validatedData = validateInput(req.body, createProblemSchema);
        const problem = await problemService.createProblem(req.user.id, validatedData);
        res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem,
        });
    }
    catch (error) {
        handleProblemError(error, res);
    }
};
/**
 * Get all problems (paginated)
 */
export const getAllProblems = async (req, res) => {
    try {
        const paginationSchema = z.object({
            page: z.coerce.number().int().positive().default(1),
            limit: z.coerce.number().int().positive().max(100).default(20),
        });
        const { page, limit } = validateInput(req.query, paginationSchema);
        const { problems, total, pages } = await problemService.getAllProblems(page, limit);
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
    }
    catch (error) {
        handleProblemError(error, res);
    }
};
/**
 * Get a single problem by ID
 */
export const getProblemById = async (req, res) => {
    try {
        const { id } = validateInput(req.params, z.object({ id: z.string().uuid("Invalid problem ID format") }));
        const problem = await problemService.getProblemById(id);
        res.status(200).json({
            success: true,
            message: "Problem fetched successfully",
            problem,
        });
    }
    catch (error) {
        handleProblemError(error, res);
    }
};
/**
 * Update an existing problem
 */
export const updateProblem = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            res
                .status(403)
                .json({ error: "You are not allowed to update a problem" });
            return;
        }
        const { id } = validateInput(req.params, z.object({ id: z.string().uuid("Invalid problem ID format") }));
        const validatedData = validateInput(req.body, updateProblemSchema);
        const problem = await problemService.updateProblem(id, req.user.id, validatedData);
        res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            problem,
        });
    }
    catch (error) {
        handleProblemError(error, res);
    }
};
/**
 * Delete a problem
 */
export const deleteProblem = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            res
                .status(403)
                .json({ error: "You are not allowed to delete a problem" });
            return;
        }
        const { id } = validateInput(req.params, z.object({ id: z.string().uuid("Invalid problem ID format") }));
        await problemService.deleteProblem(id, req.user.id);
        res.status(200).json({
            success: true,
            message: "Problem deleted successfully",
        });
    }
    catch (error) {
        handleProblemError(error, res);
    }
};
/**
 * Get all problems solved by the authenticated user
 */
export const getAllProblemsSolvedByUser = async (req, res) => {
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
    }
    catch (error) {
        handleProblemError(error, res);
    }
};
/**
 * Centralized error handler for problem controller
 */
function handleProblemError(error, res) {
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
