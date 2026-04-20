import { db } from "../libs/db.js";
import {
  buildBatchedStdin,
  executeSubmission,
  getJudge0LanguageId,
} from "../libs/judge0.lib.js";
import { splitExecutionOutput } from "../libs/output.util.js";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
} from "./errors.js";

export interface ProblemTestcase {
  input: string;
  output: string;
}

export interface CreateProblemInput {
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags?: string[];
  examples: any;
  constraints: string;
  testcases: ProblemTestcase[];
  codeSnippets: any;
  referenceSolutions: Record<string, string>;
}

export interface UpdateProblemInput {
  title?: string;
  description?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  tags?: string[];
  examples?: any;
  constraints?: string;
  testcases?: ProblemTestcase[];
  codeSnippets?: any;
  referenceSolutions?: Record<string, string>;
}

/**
 * Problem Service
 * Handles problem creation, updates, and retrieval
 */
export class ProblemService {
  /**
   * Create a new problem with reference solution validation
   */
  async createProblem(userId: string, input: CreateProblemInput): Promise<any> {
    // Validate input
    this.validateProblemInput(input);

    // Validate reference solutions
    await this.validateReferenceSolutions(
      input.testcases,
      input.referenceSolutions,
    );

    // Create problem
    const newProblem = await db.problem.create({
      data: {
        title: input.title,
        description: input.description,
        difficulty: input.difficulty,
        tags: input.tags || [],
        examples: input.examples as any,
        constraints: input.constraints,
        testcases: input.testcases as any,
        codeSnippets: input.codeSnippets as any,
        referenceSolutions: input.referenceSolutions as any,
        userId,
      },
    });

    return newProblem;
  }

  /**
   * Get all problems with optional filtering and pagination
   */
  async getAllProblems(
    page = 1,
    limit = 20,
  ): Promise<{
    problems: any[];
    total: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    const [problems, total] = await Promise.all([
      db.problem.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          difficulty: true,
          tags: true,
          examples: true,
          constraints: true,
          createdAt: true,
          _count: {
            select: {
              solvedBy: true,
              submission: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      }),
      db.problem.count(),
    ]);

    return {
      problems,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single problem by ID
   */
  async getProblemById(problemId: string): Promise<any> {
    if (!problemId) {
      throw new ValidationError("Problem ID is required");
    }

    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      throw new NotFoundError("Problem");
    }

    return problem;
  }

  /**
   * Update an existing problem
   */
  async updateProblem(
    problemId: string,
    userId: string,
    input: UpdateProblemInput,
  ): Promise<any> {
    if (!problemId) {
      throw new ValidationError("Problem ID is required");
    }

    // Check if problem exists and user is owner/admin
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      include: { user: { select: { id: true } } },
    });

    if (!problem) {
      throw new NotFoundError("Problem");
    }

    if (problem.userId !== userId) {
      throw new ForbiddenError("You are not allowed to update this problem");
    }

    // Validate reference solutions if both testcases and referenceSolutions are provided
    if (input.testcases && input.referenceSolutions) {
      await this.validateReferenceSolutions(
        input.testcases,
        input.referenceSolutions,
      );
    }

    // Update problem - only update provided fields
    const updatedProblem = await db.problem.update({
      where: { id: problemId },
      data: {
        title: input.title ?? undefined,
        description: input.description ?? undefined,
        difficulty: input.difficulty ?? undefined,
        tags: input.tags ?? undefined,
        examples: (input.examples as any) ?? undefined,
        constraints: input.constraints ?? undefined,
        testcases: (input.testcases as any) ?? undefined,
        codeSnippets: (input.codeSnippets as any) ?? undefined,
        referenceSolutions: (input.referenceSolutions as any) ?? undefined,
      },
    });

    return updatedProblem;
  }

  /**
   * Delete a problem
   */
  async deleteProblem(problemId: string, userId: string): Promise<void> {
    if (!problemId) {
      throw new ValidationError("Problem ID is required");
    }

    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      throw new NotFoundError("Problem");
    }

    if (problem.userId !== userId) {
      throw new ForbiddenError("You are not allowed to delete this problem");
    }

    await db.problem.deleteMany({ where: { id: problemId } });
  }

  /**
   * Get all problems solved by a user
   */
  async getProblemsSolvedByUser(userId: string): Promise<any[]> {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        tags: true,
        createdAt: true,
        _count: {
          select: {
            submission: true,
          },
        },
      },
    });

    return problems;
  }

  /**
   * Validate problem input
   */
  private validateProblemInput(input: any): void {
    if (!input.title || input.title.trim().length === 0) {
      throw new ValidationError("Problem title is required");
    }
    if (!input.description || input.description.trim().length === 0) {
      throw new ValidationError("Problem description is required");
    }
    if (!input.difficulty) {
      throw new ValidationError("Problem difficulty is required");
    }
    if (!Array.isArray(input.testcases) || input.testcases.length === 0) {
      throw new ValidationError("At least one test case is required");
    }
    if (
      !input.referenceSolutions ||
      Object.keys(input.referenceSolutions).length === 0
    ) {
      throw new ValidationError("At least one reference solution is required");
    }
  }

  /**
   * Validate reference solutions by running them against test cases
   */
  private async validateReferenceSolutions(
    testcases: ProblemTestcase[],
    referenceSolutions: Record<string, string>,
  ): Promise<void> {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        throw new ValidationError(`Language ${language} is not supported`);
      }

      try {
        const result = await executeSubmission({
          source_code: solutionCode,
          language_id: languageId,
          stdin: buildBatchedStdin(testcases.map(({ input }) => input)),
          expected_output: testcases.map(({ output }) => output).join("\n"),
        });

        const actualOutputs = splitExecutionOutput(result.stdout);

        for (let i = 0; i < testcases.length; i++) {
          const expectedOutput = testcases[i].output;
          const actualOutput = actualOutputs[i] || "";

          const passed =
            result.status.id === 3 &&
            actualOutput.trim() === expectedOutput.trim();

          if (!passed) {
            throw new ValidationError(
              `Reference solution failed testcase ${i + 1} for ${language}. Expected: ${expectedOutput}, Got: ${actualOutput || result.status.description}`,
            );
          }
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          throw error;
        }
        throw new InternalServerError(
          `Failed to validate reference solution for ${language}`,
        );
      }
    }
  }
}

// Export singleton instance
export const problemService = new ProblemService();
