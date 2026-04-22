import { describe, it, expect, vi, beforeEach } from "vitest";
import { submissionService } from "./submission.service.js";
import { db } from "../libs/db.js";
import { UnauthorizedError } from "./errors.js";

vi.mock("../libs/db.js", () => ({
  db: {
    submission: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe("SubmissionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllSubmissionsByUser", () => {
    it("should return submissions for a valid user", async () => {
      const mockSubmissions = [{ id: "sub-1", status: "Accepted" }];
      (db.submission.findMany as any).mockResolvedValue(mockSubmissions);

      const result = await submissionService.getAllSubmissionsByUser("user-1");

      expect(result).toEqual(mockSubmissions);
      expect(db.submission.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId: "user-1" }
      }));
    });

    it("should throw UnauthorizedError if no userId provided", async () => {
      await expect(submissionService.getAllSubmissionsByUser(""))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe("getUserSubmissionStats", () => {
    it("should calculate correct acceptance rate", async () => {
      (db.submission.count as any)
        .mockResolvedValueOnce(10) // Total
        .mockResolvedValueOnce(5); // Accepted

      const result = await submissionService.getUserSubmissionStats("user-1");

      expect(result.totalSubmissions).toBe(10);
      expect(result.acceptedSubmissions).toBe(5);
      expect(result.acceptanceRate).toBe(50);
    });

    it("should return 0 acceptance rate if no submissions", async () => {
      (db.submission.count as any).mockResolvedValue(0);

      const result = await submissionService.getUserSubmissionStats("user-1");

      expect(result.acceptanceRate).toBe(0);
    });
  });
});
