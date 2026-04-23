import { describe, it, expect, vi } from "vitest";
import { splitExecutionOutput } from "./output.util.js";

vi.mock("./judge0.lib.js", () => ({
  parseBatchedStdout: vi.fn((output) => {
    if (output?.includes("__ALGOPREP_CASE_START__")) {
      return ["output1", "output2"];
    }
    return null;
  }),
}));

describe("output.util", () => {
  it("should handle batched output with markers", () => {
    const input = "__ALGOPREP_CASE_START__\noutput1\n__ALGOPREP_CASE_END__\n__ALGOPREP_CASE_START__\noutput2\n__ALGOPREP_CASE_END__";
    const result = splitExecutionOutput(input);
    expect(result).toEqual(["output1", "output2"]);
  });

  it("should handle newline-separated output when markers are missing", () => {
    const input = "line1\nline2\nline3";
    const result = splitExecutionOutput(input);
    expect(result).toEqual(["line1", "line2", "line3"]);
  });

  it("should return empty array for non-string input", () => {
    expect(splitExecutionOutput(null)).toEqual([]);
    expect(splitExecutionOutput(undefined)).toEqual([]);
  });

  it("should handle empty string input", () => {
    expect(splitExecutionOutput("")).toEqual([]);
    expect(splitExecutionOutput("   ")).toEqual([]);
  });

  it("should normalize line endings", () => {
    const input = "line1\r\nline2";
    const result = splitExecutionOutput(input);
    expect(result).toEqual(["line1", "line2"]);
  });
});
