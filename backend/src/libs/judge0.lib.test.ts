import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
  buildBatchedStdin, 
  parseBatchedStdout, 
  executeSubmission, 
  getLanguageName,
  getJudge0LanguageId
} from "./judge0.lib.js";
import axios from "axios";

vi.mock("axios");

describe("judge0.lib", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JDOODLE_CLIENT_ID = "test-id";
    process.env.JDOODLE_CLIENT_SECRET = "test-secret";
  });

  describe("buildBatchedStdin", () => {
    it("should build stdin with counts and markers", () => {
      const inputs = ["input1", "line1\nline2"];
      const result = buildBatchedStdin(inputs);
      expect(result).toBe("2\n1\ninput1\n2\nline1\nline2");
    });
  });

  describe("parseBatchedStdout", () => {
    it("should parse stdout with markers", () => {
      const output = "__ALGOPREP_CASE_START__\nout1\n__ALGOPREP_CASE_END__\n__ALGOPREP_CASE_START__\nout2\n__ALGOPREP_CASE_END__";
      const result = parseBatchedStdout(output);
      expect(result).toEqual(["out1", "out2"]);
    });

    it("should return null if no markers found", () => {
      expect(parseBatchedStdout("plain output")).toBeNull();
    });
  });

  describe("executeSubmission", () => {
    it("should execute via axios and map response", async () => {
      (axios.post as any).mockResolvedValue({
        data: {
          output: "success",
          statusCode: 200,
          memory: "100",
          cpuTime: "0.1"
        }
      });

      const result = await executeSubmission({
        source_code: "code",
        language_id: 63,
        stdin: "in",
        expected_output: "out"
      });

      expect(result.stdout).toBe("success");
      expect(result.status.id).toBe(3); // Accepted
    });

    it("should handle compilation error", async () => {
        (axios.post as any).mockResolvedValue({
          data: {
            output: "error",
            compilationStatus: 1
          }
        });
  
        const result = await executeSubmission({
          source_code: "code",
          language_id: 63,
          stdin: "in",
          expected_output: "out"
        });
  
        expect(result.status.id).toBe(6); // Compilation Error
      });
  });

  describe("language utilities", () => {
    it("should get language name by id", () => {
      expect(getLanguageName(63)).toBe("JavaScript");
    });

    it("should throw error for unsupported language id", () => {
      expect(() => getLanguageName(999)).toThrow();
    });

    it("should get id by name", () => {
      expect(getJudge0LanguageId("javascript")).toBe(63);
      expect(getJudge0LanguageId("js")).toBe(63);
    });
  });
});
