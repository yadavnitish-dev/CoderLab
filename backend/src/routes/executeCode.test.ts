import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../index.js";
import { db } from "../libs/db.js";
import axios from "axios";
import jwt from "jsonwebtoken";

// Mock dependencies
vi.mock("../libs/db.js");
vi.mock("../libs/judge0.lib.js", () => ({
  executeSubmission: vi.fn(),
  buildBatchedStdin: vi.fn((inputs: string[]) => inputs.join("\n")),
  getLanguageName: vi.fn(() => "javascript"),
  parseBatchedStdout: vi.fn((output: string) => {
    if (output?.includes("__ALGOPREP_CASE_START__")) {
      return output
        .split("__ALGOPREP_CASE_START__")
        .filter(Boolean)
        .map((chunk) => chunk.split("__ALGOPREP_CASE_END__")[0].trim());
    }
    return null;
  }),
}));
vi.mock("jsonwebtoken");

describe("Execution Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/v1/execute-code", () => {
    it("should return 401 if not authenticated", async () => {
      const res = await request(app).post("/api/v1/execute-code").send({
        problemId: "1",
        language: "javascript",
        sourceCode: "console.log(1);",
      });

      expect(res.status).toBe(401);
    });

    it("should execute code and return verdict", async () => {
      // 1. Mock Authentication
      (jwt.verify as any).mockReturnValue({ id: "user-123" });
      (db.user.findUnique as any).mockResolvedValue({ id: "user-123", role: "USER", isVerified: true });

      // 2. Mock Problem & Testcases
      const mockProblemId = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID
      (db.problem.findUnique as any).mockResolvedValue({
        id: mockProblemId,
        testcases: [{ input: "1", output: "1" }],
      });

      // 3. Mock JDoodle API Response
      const { executeSubmission } = await import("../libs/judge0.lib.js");
      (executeSubmission as any).mockResolvedValue({
        stdout: "__ALGOPREP_CASE_START__\n1\n__ALGOPREP_CASE_END__",
        status: { id: 3, description: "Accepted" },
        memory: "100",
        time: "0.1",
      });

      // 4. Mock Submission & TestCaseResult creation
      (db.submission.create as any).mockResolvedValue({ id: "sub-1" });
      (db.testCaseResult.createMany as any).mockResolvedValue({ count: 1 });

      const res = await request(app)
        .post("/api/v1/execute-code")
        .set("Cookie", ["jwt=valid-token"])
        .send({
          problemId: mockProblemId,
          language_id: 63, // JavaScript
          source_code: "console.log(1);",
          stdin: ["1"],
          expected_outputs: ["1"],
          mode: "run"
        });

      expect(res.status).toBe(200);
      expect(res.body.execution.status).toBe("Accepted");
      expect(res.body.execution.testCases[0].passed).toBe(true);
    });
  });
});
