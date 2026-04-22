import { db } from "../libs/db.js";
import { cacheManager } from "../libs/redis.lib.js";
import {
  buildBatchedStdin,
  executeSubmission,
  getLanguageName,
} from "../libs/judge0.lib.js";
import { splitExecutionOutput } from "../libs/output.util.js";
import { UnauthorizedError, ValidationError } from "./errors.js";

export interface ExecuteCodeInput {
  source_code: string;
  language_id: number;
  stdin: string[];
  expected_outputs: string[];
  problemId: string;
  mode?: "run" | "submit";
}

export interface TestResult {
  testCase: number;
  passed: boolean;
  stdout: string;
  expected: string;
  stderr: string | null;
  compileOutput: string | null;
  status: string;
  memory?: string;
  time?: string;
}

export interface ExecutionResponse {
  sourceCode: string;
  language: string;
  stdin: string;
  stdout: string;
  stderr: string | null;
  compileOutput: string | null;
  status: string;
  memory: string | null;
  time: string | null;
  testCases: TestResult[];
}

/**
 * Code Execution Service
 * Handles code execution, test case evaluation, and submission recording
 */
export class CodeExecutionService {
  /**
   * Execute code against test cases (run mode)
   */
  async executeCode(userId: string, input: ExecuteCodeInput): Promise<ExecutionResponse> {
    if (!userId) {
      throw new UnauthorizedError();
    }

    // Validate input
    this.validateExecutionInput(input);

    // Execute code
    const result = await this.runExecution(input);

    return result;
  }

  /**
   * Submit code as a solution (submit mode)
   */
  async submitCode(
    userId: string,
    input: ExecuteCodeInput
  ): Promise<{
    submission: any;
    execution: ExecutionResponse;
  }> {
    if (!userId) {
      throw new UnauthorizedError();
    }

    // Validate input
    this.validateExecutionInput(input);

    // Execute code
    const execution = await this.runExecution(input);

    // Save submission
    const submission = await db.submission.create({
      data: {
        userId,
        problemId: input.problemId,
        sourceCode: execution.sourceCode,
        language: execution.language,
        stdin: execution.stdin,
        stdout: execution.stdout,
        stderr: execution.stderr,
        compileOutput: execution.compileOutput,
        status: execution.status,
        memory: execution.memory,
        time: execution.time,
      },
    });

    // Mark problem as solved if all tests passed
    if (execution.status === "Accepted") {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId: input.problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId: input.problemId,
        },
      });

      // Invalidate user solved problems cache
      await cacheManager.invalidate(`user:${userId}:solved`);
    }

    // Save test case results
    const testCaseResults = execution.testCases.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    // Fetch submission with test cases
    const submissionWithTestCases = await db.submission.findUnique({
      where: { id: submission.id },
      include: { testCases: true },
    });

    return {
      submission: submissionWithTestCases,
      execution,
    };
  }

  /**
   * Run code execution and evaluate test cases
   */
  private async runExecution(input: ExecuteCodeInput): Promise<ExecutionResponse> {
    // Batch execution inputs
    const batchedStdin = buildBatchedStdin(input.stdin);

    // Execute on Judge0
    const result = await executeSubmission({
      source_code: input.source_code,
      language_id: input.language_id,
      stdin: batchedStdin,
      expected_output: input.expected_outputs.join("\n"),
    });

    // Parse outputs
    const actualOutputs = splitExecutionOutput(result.stdout);

    // Evaluate test cases
    let allPassed = true;
    const testResults: TestResult[] = input.stdin.map((_: string, i: number) => {
      const rawStdout = actualOutputs[i];
      const rawExpected = input.expected_outputs[i];

      const stdout = typeof rawStdout === "string" ? rawStdout.trim() : "";
      const expected = typeof rawExpected === "string" ? rawExpected.trim() : "";

      const judgeSucceeded = result.status.id === 3;
      const passed = judgeSucceeded && stdout === expected;

      if (!passed) {
        allPassed = false;
      }

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected,
        stderr: result.stderr || null,
        compileOutput: result.compile_output || null,
        status: passed
          ? "Accepted"
          : judgeSucceeded
            ? "Wrong Answer"
            : result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });

    const finalStatus = testResults.find((r) => !r.passed)?.status;

    return {
      sourceCode: input.source_code,
      language: getLanguageName(input.language_id),
      stdin: input.stdin.join("\n"),
      stdout: JSON.stringify(testResults.map((r) => r.stdout)),
      stderr: testResults.some((r) => r.stderr)
        ? JSON.stringify(testResults.map((r) => r.stderr))
        : null,
      compileOutput: testResults.some((r) => r.compileOutput)
        ? JSON.stringify(testResults.map((r) => r.compileOutput))
        : null,
      status: allPassed ? "Accepted" : finalStatus || "Wrong Answer",
      memory: testResults.some((r) => r.memory)
        ? JSON.stringify(testResults.map((r) => r.memory))
        : null,
      time: testResults.some((r) => r.time)
        ? JSON.stringify(testResults.map((r) => r.time))
        : null,
      testCases: testResults,
    };
  }

  /**
   * Validate execution input
   */
  private validateExecutionInput(input: ExecuteCodeInput): void {
    if (!input.source_code || input.source_code.trim().length === 0) {
      throw new ValidationError("Source code is required");
    }

    if (!input.language_id) {
      throw new ValidationError("Language ID is required");
    }

    if (!Array.isArray(input.stdin) || input.stdin.length === 0) {
      throw new ValidationError("At least one test case is required");
    }

    if (
      !Array.isArray(input.expected_outputs) ||
      input.expected_outputs.length === 0
    ) {
      throw new ValidationError("Expected outputs are required");
    }

    if (input.stdin.length !== input.expected_outputs.length) {
      throw new ValidationError(
        "Number of inputs must match number of expected outputs"
      );
    }

    if (!input.problemId) {
      throw new ValidationError("Problem ID is required");
    }
  }
}

// Export singleton instance
export const codeExecutionService = new CodeExecutionService();
