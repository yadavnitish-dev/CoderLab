import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Submission } from "../types";

interface SubmissionState {
  isLoading: boolean;
  submissions: Submission[];
  submission: Submission | null; 
  
  submissionCount: number | null;

  getAllSubmissions: () => Promise<void>;
  getSubmissionForProblem: (problemId: string) => Promise<void>;
  getSubmissionCountForProblem: (problemId: string) => Promise<void>;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  isLoading: false,
  submissions: [],
  submission: null as any, 
  
  submissionCount: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/submission/get-all-submissions");

      set({ submissions: res.data.submissions });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all submissions", error);
      toast.error("Error getting all submissions");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId: string) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submission/${problemId}`
      );

      set({ submissions: res.data.submissions }); 
    } catch (error) {
      console.log("Error getting submissions for problem", error);

      toast.error("Error getting submissions for problem");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (problemId: string) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submissions-count/${problemId}`
      );

      set({ submissionCount: res.data.count });
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },
}));

