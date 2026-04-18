import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Problem } from "../types";

interface ProblemState {
  problems: Problem[];
  problem: Problem | null;
  solvedProblems: Problem[];
  isProblemsLoading: boolean;
  isProblemLoading: boolean;

  getAllProblems: () => Promise<void>;
  getProblemById: (id: string) => Promise<void>;
  getSolvedProblemByUser: () => Promise<void>;
  removeProblem: (id: string) => void;
}

export const useProblemStore = create<ProblemState>((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problems");

      set({ problems: res.data.problems });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id: string) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/get-problem/${id}`);

      set({ problem: res.data.problem });

    } catch (error) {
      console.log("Error getting problem", error);
      toast.error("Error in getting problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");

      set({ solvedProblems: res.data.problems });
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  },
  removeProblem: (id: string) => {
    set((state) => ({
      problems: state.problems.filter((p) => p.id !== id),
    }));
  },
}));

