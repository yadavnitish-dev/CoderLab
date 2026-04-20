import { db } from "../libs/db.js";
import { UnauthorizedError, NotFoundError } from "./errors.js";
/**
 * Submission Service
 * Handles user code submission queries and retrieval
 */
export class SubmissionService {
    /**
     * Get all submissions for a user
     */
    async getAllSubmissionsByUser(userId) {
        if (!userId) {
            throw new UnauthorizedError();
        }
        const submissions = await db.submission.findMany({
            where: { userId },
            include: { testCases: true },
            orderBy: { createdAt: "desc" },
        });
        return submissions;
    }
    /**
     * Get submissions for a specific problem by a user
     */
    async getSubmissionsForProblem(userId, problemId) {
        if (!userId) {
            throw new UnauthorizedError();
        }
        const submissions = await db.submission.findMany({
            where: {
                userId,
                problemId,
            },
            include: {
                testCases: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return submissions;
    }
    /**
     * Get total submission count for a problem
     */
    async getSubmissionCountForProblem(problemId) {
        if (!problemId) {
            throw new NotFoundError("Problem");
        }
        const count = await db.submission.count({
            where: { problemId },
        });
        return count;
    }
    /**
     * Get user's highest acceptance rate for problems
     */
    async getUserSubmissionStats(userId) {
        if (!userId) {
            throw new UnauthorizedError();
        }
        const totalSubmissions = await db.submission.count({
            where: { userId },
        });
        const acceptedSubmissions = await db.submission.count({
            where: {
                userId,
                status: "Accepted",
            },
        });
        const acceptanceRate = totalSubmissions > 0
            ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
            : 0;
        return {
            totalSubmissions,
            acceptedSubmissions,
            acceptanceRate,
        };
    }
}
// Export singleton instance
export const submissionService = new SubmissionService();
