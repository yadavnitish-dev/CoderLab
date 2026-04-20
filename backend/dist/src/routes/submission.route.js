import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { generalLimiter } from "../middleware/rateLimiter.middleware.js";
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionsForProblem, } from "../controllers/submission.controller.js";
const submissionRoutes = express.Router();
submissionRoutes.get("/get-all-submissions", authMiddleware, generalLimiter, getAllSubmission);
submissionRoutes.get("/get-submission/:problemId", authMiddleware, generalLimiter, getSubmissionsForProblem);
submissionRoutes.get("/get-submissions-count/:problemId", authMiddleware, generalLimiter, getAllTheSubmissionsForProblem);
export default submissionRoutes;
