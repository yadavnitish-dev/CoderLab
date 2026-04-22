import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../index.js";
import { db } from "../libs/db.js";

// Mock dependencies
vi.mock("../libs/db.js");

describe("Problem Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/problems/get-all-problems", () => {
    it("should return a list of problems with pagination", async () => {
      const mockProblems = [
        { id: "1", title: "Two Sum", difficulty: "EASY", tags: ["array"] },
        { id: "2", title: "Add Two Numbers", difficulty: "MEDIUM", tags: ["linked-list"] },
      ];

      (db.problem.findMany as any).mockResolvedValue(mockProblems);
      (db.problem.count as any).mockResolvedValue(2);

      const res = await request(app).get("/api/v1/problems/get-all-problems");

      expect(res.status).toBe(200);
      expect(res.body.problems).toHaveLength(2);
      expect(res.body.pagination.total).toBe(2);
      expect(res.body.problems[0].title).toBe("Two Sum");
    });
  });

  describe("GET /api/v1/problems/get-problem/:id", () => {
    it("should return a 404 if problem not found", async () => {
      (db.problem.findUnique as any).mockResolvedValue(null);

      const res = await request(app).get("/api/v1/problems/get-problem/999");
      expect(res.status).toBe(404);
    });

    it("should return problem details if found", async () => {
      const mockProblem = {
        id: "1",
        title: "Two Sum",
        description: "Solve it.",
        difficulty: "EASY",
      };

      (db.problem.findUnique as any).mockResolvedValue(mockProblem);

      const res = await request(app).get("/api/v1/problems/get-problem/1");

      expect(res.status).toBe(200);
      expect(res.body.problem.title).toBe("Two Sum");
    });
  });
});
