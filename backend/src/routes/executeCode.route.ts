import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { sanitizeInputs } from "../middleware/validation.middleware.js";
import { codeExecutionLimiter } from "../middleware/rateLimiter.middleware.js";
import { executeCode } from "../controllers/executeCode.controller.js";

// Middleware to allow larger payloads for code execution (200KB limit)
const largePayloadMiddleware = express.json({ limit: "200kb" });

const executionRoutes = express.Router();

executionRoutes.post(
  "/",
  largePayloadMiddleware,
  authMiddleware,
  codeExecutionLimiter,
  sanitizeInputs,
  executeCode,
);

export default executionRoutes;
