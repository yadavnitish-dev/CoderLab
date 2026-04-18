import { db } from "../libs/db.js";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getAllSubmission = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.user.id;

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

export const getSubmissionsForProblem = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.user.id;
    const problemId = req.params.problemId;
    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
      include: {
        testCases: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submission fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

export const getAllTheSubmissionsForProblem = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const problemId = req.params.problemId;
    const submission = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions Fetched successfully",
      count: submission,
    });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

