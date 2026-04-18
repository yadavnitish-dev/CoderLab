import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useProblemStore } from "./useProblemStore";

interface ActionState {
  isDeletingProblem: boolean;
  onDeleteProblem: (id: string) => Promise<void>;
}

export const useActions = create<ActionState>((set) => ({
  isDeletingProblem: false,

  onDeleteProblem: async (id: string) => {
    try {
      set({ isDeletingProblem: true });
      const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
      
      useProblemStore.getState().removeProblem(id);
      
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error deleting problem", error);
      toast.error("Error deleting problem");
    } finally {
      set({ isDeletingProblem: false });
    }
  },
}));

