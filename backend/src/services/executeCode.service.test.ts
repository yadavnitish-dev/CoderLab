import { describe, it, expect, vi, beforeEach } from "vitest";
import { codeExecutionService } from "./executeCode.service.js";
import { db } from "../libs/db.js";
import { cacheManager } from "../libs/redis.lib.js";
import { UnauthorizedError, ValidationError } from "./errors.js";

vi.mock("../libs/db.js", () => ({
  db: {
    submission: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    problemSolved: {
      upsert: vi.fn(),
    },
    testCaseResult: {
      createMany: vi.fn(),
    },
  },
}));

vi.mock("../libs/redis.lib.js", () => ({
  cacheManager: {
    invalidate: vi.fn(),
  },
}));

vi.mock("../libs/judge0.lib.js", () => ({
  executeSubmission: vi.fn(),
  buildBatchedStdin: vi.fn((inputs: string[]) => inputs.join("\n")),
  getLanguageName: vi.fn((id) => (id === 63 ? "javascript" : "unknown")),
}));

vi.mock("../libs/output.util.js", () => ({
  splitExecutionOutput: vi.fn((stdout) => (stdout ? stdout.split("\n") : [])),
}));

describe("CodeExecutionService", () => {
  const validUser = "user-1";
  const validInput = {
    source_code: "console.log(3);",
    language_id: 63,
    stdin: ["1 2"],
    expected_outputs: ["3"],
    problemId: "p-1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("executeCode", () => {
    it("should return Accepted verdict if output matches", async () => {
      const { executeSubmission } = await import("../libs/judge0.lib.js");
      (executeSubmission as any).mockResolvedValue({
        stdout: "3",
        status: { id: 3, description: "Accepted" },
      });

      const result = await codeExecutionService.executeCode(validUser, validInput);

      expect(result.status).toBe("Accepted");
      expect(result.testCases[0].passed).toBe(true);
    });

    it("should return Wrong Answer verdict if output does not match", async () => {
      const { executeSubmission } = await import("../libs/judge0.lib.js");
      (executeSubmission as any).mockResolvedValue({
        stdout: "Wrong",
        status: { id: 3, description: "Accepted" },
      });

      const result = await codeExecutionService.executeCode(validUser, validInput);

      expect(result.status).toBe("Wrong Answer");
      expect(result.testCases[0].passed).toBe(false);
    });

    it("should throw ValidationError for invalid inputs", async () => {
      await expect(codeExecutionService.executeCode(validUser, { ...validInput, source_code: "" }))
        .rejects.toThrow(ValidationError);
      await expect(codeExecutionService.executeCode(validUser, { ...validInput, language_id: 0 }))
        .rejects.toThrow(ValidationError);
      await expect(codeExecutionService.executeCode(validUser, { ...validInput, stdin: [] }))
        .rejects.toThrow(ValidationError);
      await expect(codeExecutionService.executeCode(validUser, { ...validInput, expected_outputs: ["3", "4"] }))
        .rejects.toThrow(ValidationError);
    });

    it("should return Runtime Error if Judge0 status is not Accepted", async () => {
      const { executeSubmission } = await import("../libs/judge0.lib.js");
      (executeSubmission as any).mockResolvedValue({
        stdout: "",
        stderr: "Memory limit exceeded",
        status: { id: 6, description: "Runtime Error (SIGSEGV)" },
      });

      const result = await codeExecutionService.executeCode(validUser, validInput);

      expect(result.status).toBe("Runtime Error (SIGSEGV)");
      expect(result.testCases[0].passed).toBe(false);
    });
  });

  describe("submitCode", () => {
    it("should record submission and mark as solved on success", async () => {
      const { executeSubmission } = await import("../libs/judge0.lib.js");
      (executeSubmission as any).mockResolvedValue({
        stdout: "3",
        status: { id: 3, description: "Accepted" },
      });
      (db.submission.create as any).mockResolvedValue({ id: "sub-1" });
      (db.submission.findUnique as any).mockResolvedValue({ id: "sub-1", testCases: [] });

      const result = await codeExecutionService.submitCode(validUser, validInput);

      expect(result.submission.id).toBe("sub-1");
      expect(db.problemSolved.upsert).toHaveBeenCalled();
      expect(cacheManager.invalidate).toHaveBeenCalledWith(`user:${validUser}:solved`);
    });

    it("should NOT mark as solved on failure", async () => {
        const { executeSubmission } = await import("../libs/judge0.lib.js");
        (executeSubmission as any).mockResolvedValue({
          stdout: "Wrong",
          status: { id: 3, description: "Accepted" },
        });
        (db.submission.create as any).mockResolvedValue({ id: "sub-1" });
        (db.submission.findUnique as any).mockResolvedValue({ id: "sub-1", testCases: [] });
  
        await codeExecutionService.submitCode(validUser, validInput);
  
        expect(db.problemSolved.upsert).not.toHaveBeenCalled();
      });
  });
});
