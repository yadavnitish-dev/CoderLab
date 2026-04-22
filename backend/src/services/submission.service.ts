import { db } from "../libs/db.js";
import { UnauthorizedError, NotFoundError } from "./errors.js";

export interface TestCaseResponse {
  id: string;
  passed: boolean;
  expected: string;
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  status: any;
  memory: string | null;
  time: string | null;
}

export interface SubmissionWithTestCases {
  id: string;
  userId: string;
  problemId: string;
  sourceCode: string;
  language: string;
  stdin?: string | null;
  stdout?: string | null;
  stderr?: string | null;
  compileOutput?: string | null;
  status: string;
  memory?: string | null;
  time?: string | null;
  createdAt: Date;
  updatedAt: Date;
  testCases: TestCaseResponse[];
}

/**
 * Submission Service
 * Handles user code submission queries and retrieval
 */
export class SubmissionService {
  /**
   * Get all submissions for a user
   */
  async getAllSubmissionsByUser(userId: string): Promise<SubmissionWithTestCases[]> {
    if (!userId) {
      throw new UnauthorizedError();
    }

    const submissions = await db.submission.findMany({
      where: { userId },
      include: { testCases: true },
      orderBy: { createdAt: "desc" },
    });

    return submissions as unknown as SubmissionWithTestCases[];
  }

  /**
   * Get submissions for a specific problem by a user
   */
  async getSubmissionsForProblem(
    userId: string,
    problemId: string
  ): Promise<SubmissionWithTestCases[]> {
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

    return submissions as unknown as SubmissionWithTestCases[];
  }

  /**
   * Get total submission count for a problem
   */
  async getSubmissionCountForProblem(problemId: string): Promise<number> {
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
  async getUserSubmissionStats(userId: string): Promise<{
    totalSubmissions: number;
    acceptedSubmissions: number;
    acceptanceRate: number;
  }> {
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

    const acceptanceRate =
      totalSubmissions > 0
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
