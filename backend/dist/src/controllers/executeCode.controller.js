import { codeExecutionService, AppError } from "../services/index.js";
import { validateInput } from "../services/validation.helper.js";
import { executeCodeSchemaWithValidation, } from "../middleware/validation.schema.js";
/**
 * Execute code against test cases (run mode only)
 */
export const executeCode = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const validatedData = validateInput(req.body, executeCodeSchemaWithValidation);
        if (validatedData.mode === "submit") {
            // Submit mode: save to database and mark problem as solved
            const { submission, execution } = await codeExecutionService.submitCode(req.user.id, validatedData);
            res.status(200).json({
                success: true,
                message: "Code submitted successfully",
                submission,
                execution,
            });
            return;
        }
        // Run mode: just execute and return results
        const execution = await codeExecutionService.executeCode(req.user.id, validatedData);
        res.status(200).json({
            success: true,
            message: "Code executed successfully",
            execution,
        });
    }
    catch (error) {
        handleExecutionError(error, res);
    }
};
/**
 * Centralized error handler for execution controller
 */
function handleExecutionError(error, res) {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            error: error.message,
            code: error.code,
        });
        return;
    }
    console.error("Unexpected error in execution controller:", error);
    res.status(500).json({
        error: "Failed to execute code",
    });
}
