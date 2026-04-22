import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProblemStore } from "./useProblemStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

vi.mock("../lib/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("useProblemStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useProblemStore.setState({
      problems: [],
      problem: null,
      solvedProblems: [],
      isProblemsLoading: false,
      isProblemLoading: false,
    });
  });

  it("should fetch all problems successfully", async () => {
    const mockProblems = [{ id: "1", title: "Two Sum" }];
    (axiosInstance.get as any).mockResolvedValue({ data: { problems: mockProblems } });

    await useProblemStore.getState().getAllProblems();

    expect(useProblemStore.getState().problems).toEqual(mockProblems);
    expect(useProblemStore.getState().isProblemsLoading).toBe(false);
  });

  it("should handle fetch problems error", async () => {
    (axiosInstance.get as any).mockRejectedValue(new Error("Network Error"));

    await useProblemStore.getState().getAllProblems();

    expect(toast.error).toHaveBeenCalledWith("Failed to load problems");
  });

  it("should fetch problem by id successfully", async () => {
    const mockProblem = { id: "1", title: "Two Sum" };
    (axiosInstance.get as any).mockResolvedValue({ data: { problem: mockProblem } });

    await useProblemStore.getState().getProblemById("1");

    expect(useProblemStore.getState().problem).toEqual(mockProblem);
  });

  it("should remove problem from local state", () => {
    useProblemStore.setState({ 
      problems: [{ id: "1", title: "P1" }, { id: "2", title: "P2" }] as any 
    });

    useProblemStore.getState().removeProblem("1");

    expect(useProblemStore.getState().problems).toHaveLength(1);
    expect(useProblemStore.getState().problems[0].id).toBe("2");
  });
});
