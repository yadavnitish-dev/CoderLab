import { db } from "../libs/db.js";
import {
  buildBatchedStdin,
  executeSubmission,
  getLanguageName,
  parseBatchedStdout,
} from "../libs/judge0.lib.js";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

interface TestResult {
  testCase: number;
  passed: boolean;
  stdout: string | undefined;
  expected: string | undefined;
  stderr: string | null;
  compile_output: string | null;
  status: any;
  memory: string | undefined;
  time: string | undefined;
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

export const executeCode = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const {
      source_code,
      language_id,
      stdin,
      expected_outputs,
      problemId,
      mode = "run",
    } =
      req.body;

    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.user.id;

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing test cases" });
    }

    const combinedSubmission = {
      source_code,
      language_id,
      stdin: buildBatchedStdin(stdin),
      expected_output: expected_outputs.join("\n"),
    };

    const result = await executeSubmission(combinedSubmission);
    const actualOutputs = splitExecutionOutput(result.stdout);

    let allPassed = true;
    const detailedResults: TestResult[] = stdin.map((_: string, i: number) => {
      const stdout = actualOutputs[i]?.trim();
      const expectedOutput = expected_outputs[i]?.trim();
      const judgeSucceeded = result.status.id === 3;
      const passed = judgeSucceeded && stdout === expectedOutput;

      if (!passed) {
        allPassed = false;
      }

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expectedOutput,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: passed ? "Accepted" : result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });

    const finalStatus = detailedResults.find((result) => !result.passed)?.status;
    const responseSubmission = {
      sourceCode: source_code,
      language: getLanguageName(language_id),
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
      stderr: detailedResults.some((r) => r.stderr)
        ? JSON.stringify(detailedResults.map((r) => r.stderr))
        : null,
      compileOutput: detailedResults.some((r) => r.compile_output)
        ? JSON.stringify(detailedResults.map((r) => r.compile_output))
        : null,
      status: allPassed ? "Accepted" : finalStatus || "Wrong Answer",
      memory: detailedResults.some((r) => r.memory)
        ? JSON.stringify(detailedResults.map((r) => r.memory))
        : null,
      time: detailedResults.some((r) => r.time)
        ? JSON.stringify(detailedResults.map((r) => r.time))
        : null,
      testCases: detailedResults.map((result) => ({
        testCase: result.testCase,
        passed: result.passed,
        stdout: result.stdout || "",
        expected: result.expected || "",
        stderr: result.stderr,
        compileOutput: result.compile_output,
        status: result.status,
        memory: result.memory,
        time: result.time,
      })),
    };

    if (mode === "run") {
      return res.status(200).json({
        success: true,
        message: "Code executed successfully",
        submission: responseSubmission,
      });
    }

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: responseSubmission.sourceCode,
        language: responseSubmission.language,
        stdin: responseSubmission.stdin,
        stdout: responseSubmission.stdout,
        stderr: responseSubmission.stderr,
        compileOutput: responseSubmission.compileOutput,
        status: responseSubmission.status,
        memory: responseSubmission.memory,
        time: responseSubmission.time,
      },
    });

    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout || "",
      expected: result.expected || "",
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });
    
    return res.status(200).json({
      success: true,
      message: "Code submitted successfully",
      submission: submissionWithTestCase,
    });
  } catch (error: any) {
    console.error("Error executing code:", error?.message || error);
    return res.status(500).json({ error: "Failed to execute code" });
  }
};
