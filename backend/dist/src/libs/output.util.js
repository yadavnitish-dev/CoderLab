import { parseBatchedStdout } from "./judge0.lib.js";
/**
 * Splits execution output into individual test case results.
 * Handles both batched output (with markers) and regular newline-separated output.
 * @param output - The raw stdout from code execution
 * @returns Array of trimmed output strings, one per test case
 */
export const splitExecutionOutput = (output) => {
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
