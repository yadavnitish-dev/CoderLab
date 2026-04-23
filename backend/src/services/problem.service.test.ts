import { describe, it, expect, vi, beforeEach } from "vitest";
import { problemService } from "./problem.service.js";
import { db } from "../libs/db.js";
import { cacheManager } from "../libs/redis.lib.js";
import { 
  ValidationError, 
  NotFoundError, 
  ForbiddenError 
} from "./errors.js";

// Mock the database, cache, and judge0
vi.mock("../libs/db.js", () => ({
  db: {
    problem: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("../libs/redis.lib.js", () => ({
  cacheManager: {
    getOrSet: vi.fn((key, cb) => cb()),
    invalidate: vi.fn(),
  },
}));

vi.mock("../libs/judge0.lib.js", () => ({
  executeSubmission: vi.fn(),
  buildBatchedStdin: vi.fn((inputs: string[]) => inputs.join("\n")),
  getJudge0LanguageId: vi.fn((lang) => (lang === "javascript" ? 63 : null)),
}));

vi.mock("../libs/output.util.js", () => ({
  splitExecutionOutput: vi.fn((stdout) => stdout ? [stdout.trim()] : []),
}));

describe("ProblemService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProblemById", () => {
    it("should return a problem if it exists", async () => {
      const mockProblem = { id: "p-1", title: "Test Problem" };
      (db.problem.findUnique as any).mockResolvedValue(mockProblem);

      const result = await problemService.getProblemById("p-1");

      expect(result).toEqual(mockProblem);
      expect(db.problem.findUnique).toHaveBeenCalledWith({ where: { id: "p-1" } });
    });

    it("should throw NotFoundError if problem does not exist", async () => {
      (db.problem.findUnique as any).mockResolvedValue(null);

      await expect(problemService.getProblemById("p-1"))
        .rejects.toThrow(NotFoundError);
    });

    it("should throw ValidationError if no ID provided", async () => {
      await expect(problemService.getProblemById(""))
        .rejects.toThrow(ValidationError);
    });
  });

  describe("deleteProblem", () => {
    it("should delete problem if user is the owner", async () => {
      const mockProblem = { id: "p-1", userId: "user-1" };
      (db.problem.findUnique as any).mockResolvedValue(mockProblem);

      await problemService.deleteProblem("p-1", "user-1");

      expect(db.problem.delete).toHaveBeenCalled();
      expect(cacheManager.invalidate).toHaveBeenCalled();
    });

    it("should throw ForbiddenError if user is not the owner", async () => {
      const mockProblem = { id: "p-1", userId: "user-owner" };
      (db.problem.findUnique as any).mockResolvedValue(mockProblem);

      await expect(problemService.deleteProblem("p-1", "user-malicious"))
        .rejects.toThrow(ForbiddenError);
    });
  });

  describe("createProblem", () => {
    const validProblemInput = {
      title: "Sum",
      description: "Add two numbers",
      difficulty: "EASY" as const,
      testcases: [{ input: "1 2", output: "3" }],
      referenceSolutions: { javascript: "console.log(3);" },
      examples: [],
      constraints: "none",
      codeSnippets: {},
    };

    it("should create problem if reference solutions are valid", async () => {
      const { executeSubmission } = await import("../libs/judge0.lib.js");
      (executeSubmission as any).mockResolvedValue({
        stdout: "3",
        status: { id: 3, description: "Accepted" },
      });
      (db.problem.create as any).mockResolvedValue({ id: "p-new", ...validProblemInput });

      const result = await problemService.createProblem("user-1", validProblemInput);

      expect(result.id).toBe("p-new");
      expect(db.problem.create).toHaveBeenCalled();
    });

    it("should throw ValidationError if reference solution fails testcase", async () => {
      const { executeSubmission } = await import("../libs/judge0.lib.js");
      (executeSubmission as any).mockResolvedValue({
        stdout: "Wrong Output",
        status: { id: 3, description: "Accepted" },
      });

      await expect(problemService.createProblem("user-1", validProblemInput))
        .rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError if language is not supported", async () => {
        const invalidLangInput = { 
            ...validProblemInput, 
            referenceSolutions: { brainfuck: "some code" } 
        };

        await expect(problemService.createProblem("user-1", invalidLangInput))
          .rejects.toThrow(ValidationError);
    });
  });

  describe("getAllProblems", () => {
    it("should return problems and pagination metadata", async () => {
      (db.problem.findMany as any).mockResolvedValue([{ id: "p-1" }]);
      (db.problem.count as any).mockResolvedValue(1);

      const result = await problemService.getAllProblems(1, 10);

      expect(result.problems).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe("updateProblem", () => {
    it("should update problem successfully", async () => {
      (db.problem.findUnique as any).mockResolvedValue({ id: "p-1", userId: "user-1" });
      (db.problem.update as any).mockResolvedValue({ id: "p-1", title: "New Title" });

      const result = await problemService.updateProblem("p-1", "user-1", { title: "New Title" });

      expect(result.title).toBe("New Title");
      expect(db.problem.update).toHaveBeenCalled();
    });

    it("should throw ForbiddenError if not owner", async () => {
      (db.problem.findUnique as any).mockResolvedValue({ id: "p-1", userId: "owner" });
      await expect(problemService.updateProblem("p-1", "stranger", { title: "Title" }))
        .rejects.toThrow(ForbiddenError);
    });
  });
});
