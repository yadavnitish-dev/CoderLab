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
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  isRunning: false,
  isSubmitting: false,
  submission: null,

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
      console.log(
        "Submission:",
        JSON.stringify({
          source_code,
          language_id,
          stdin,
          expected_outputs,
          problemId,
        })
      );
      const res = await axiosInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
        mode,
      });

      set({ submission: res.data.submission });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error executing code", error);
      toast.error("Error executing code");
    } finally {
      if (mode === "run") {
        set({ isRunning: false });
      } else {
        set({ isSubmitting: false });
      }
    }
  },
}));
