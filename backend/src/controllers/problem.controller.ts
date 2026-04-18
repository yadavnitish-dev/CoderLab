import { db } from "../libs/db.js";
import {
  buildBatchedStdin,
  executeSubmission,
  getJudge0LanguageId,
  parseBatchedStdout,
} from "../libs/judge0.lib.js";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

interface ProblemTestcase {
  input: string;
  output: string;
}

const splitExecutionOutput = (output: string | null | undefined) => {
  const batchedOutput = parseBatchedStdout(output);
  if (batchedOutput) {
    return batchedOutput.map((line) => line.trim());
  }

  if (typeof output !== "string") {
    return [];
  }

  const normalizedOutput = output.replace(/\r\n/g, "\n").trim();
  if (!normalizedOutput) {
    return [];
  }

  return normalizedOutput.split("\n").map((line) => line.trim());
};

export const createProblem = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (!req.user || req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "You are not allowed to create a problem" });
  }

  try {
    const typedTestcases = testcases as ProblemTestcase[];

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({
          error: `Language ${language} is not supported`,
        });
      }

      // @ts-ignore
      const result = await executeSubmission({
        source_code: solutionCode as string,
        language_id: languageId,
        stdin: buildBatchedStdin(typedTestcases.map(({ input }) => input)),
        expected_output: typedTestcases.map(({ output }) => output).join("\n"),
      });

      const actualOutputs = splitExecutionOutput(result.stdout);

      for (let i = 0; i < typedTestcases.length; i++) {
        const expectedOutput = typedTestcases[i].output;
        const actualOutput = actualOutputs[i] || "";
        const passed =
          result.status.id === 3 &&
          actualOutput.trim() === expectedOutput.trim();

        if (!passed) {
          return res.status(400).json({
            error: `Reference solution failed testcase ${i + 1} for ${language}. Expected: ${expectedOutput}, Got: ${actualOutput || result.status.description}`,
          });
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions: referenceSolutions as any,
        userId: req.user.id,
      },
    });

    return res.status(201).json(newProblem);
  } catch (error) {
    console.error("Error in createProblem:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProblems = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const problems = await db.problem.findMany({
      include: {
        solvedBy: true,
      },
    });

    if (!problems || problems.length === 0) {
      return res.status(404).json({ error: "No problems found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.error("Error in getAllProblems:", error);
    return res.status(500).json({ error: "Error fetching problems" });
  }
};

export const getProblemById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Problem ID is required" });
  }
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem,
    });
  } catch (error) {
    console.error("Error in getProblemById:", error);
    return res.status(500).json({ error: "Error fetching problem" });
  }
};

export const updateProblem = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (!req.user || req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "You are not allowed to update a problem" });
  }
  if (!id) {
    return res.status(400).json({ error: "Problem ID is required" });
  }
  try {
    const problem = await db.problem.findUnique({
      where: { id },
    });
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const updatedProblem = await db.problem.update({
      where: { id },
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions: referenceSolutions as any,
        userId: req.user.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.error("Error in updateProblem:", error);
    return res.status(500).json({ error: "Error updating problem" });
  }
};

export const deleteProblem = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    await db.problem.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "problem deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "error while deleting the problem",
    });
  }
};

export const getAllProblemsSolvedByUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    if (!req.user) {
         return res.status(401).json({ error: "Unauthorized" });
    }
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.error("Error fetching problems :", error);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};
