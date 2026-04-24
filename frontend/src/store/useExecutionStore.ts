import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Submission } from "../types";

interface ExecutionState {
  isRunning: boolean;
  isSubmitting: boolean;
  submission: Submission | null;

  executeCode: (
    source_code: string,
    language_id: number,
    stdin: string[],
    expected_outputs: string[],
    problemId: string,
    mode?: "run" | "submit"
  ) => Promise<void>;
  pollSubmissionStatus: (submissionId: string) => Promise<void>;
}

const POLL_INTERVAL = 1000; // 1 second
const MAX_POLLS = 30; // 30 seconds timeout

export const useExecutionStore = create<ExecutionState>((set, get) => ({
  isRunning: false,
  isSubmitting: false,
  submission: null,

  pollSubmissionStatus: async (submissionId: string) => {
    let polls = 0;
    
    const poll = async () => {
      try {
        const res = await axiosInstance.get(`/execute-code/status/${submissionId}`);
        const submission = res.data.submission;
        
        if (submission.status !== "Processing") {
          set({ submission, isSubmitting: false });
          if (submission.status === "Accepted") {
            toast.success("Accepted");
          } else {
            toast.error(submission.status);
          }
          return;
        }

        if (polls >= MAX_POLLS) {
          set({ isSubmitting: false });
          toast.error("Execution timed out");
          return;
        }

        polls++;
        setTimeout(poll, POLL_INTERVAL);
      } catch (error) {
        console.error("Error polling submission status", error);
        set({ isSubmitting: false });
        toast.error("Failed to fetch execution status");
      }
    };

    setTimeout(poll, POLL_INTERVAL);
  },

  executeCode: async (
    source_code: string,
    language_id: number,
    stdin: string[],
    expected_outputs: string[],
    problemId: string,
    mode = "run"
  ) => {
    try {
      if (mode === "run") {
        set({ isRunning: true, submission: null });
      } else {
        set({ isSubmitting: true, submission: null });
      }

      const res = await axiosInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
        mode,
      });

      if (mode === "submit") {
        const { submissionId } = res.data;
        // Start polling for results
        get().pollSubmissionStatus(submissionId);
      } else {
        // Run mode returns execution results immediately
        set({ submission: res.data.execution });
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error executing code", error);
      toast.error("Execution failed");
      set({ isRunning: false, isSubmitting: false });
    } finally {
      if (mode === "run") {
        set({ isRunning: false });
      }
      // Note: isSubmitting is set to false in pollSubmissionStatus for submit mode
    }
  },
}));
