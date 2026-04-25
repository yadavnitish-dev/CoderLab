import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Submission } from "../types";

interface SubmissionsListProps {
  submissions: Submission[] | null;
  isLoading: boolean;
  onSubmissionClick?: (submission: Submission) => void;
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({
  submissions,
  isLoading,
  onSubmissionClick,
}) => {
  const safeParse = (data: string | null | undefined) => {
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  const calculateAverageMemory = (memoryData: string | null | undefined) => {
    const memoryArray = safeParse(memoryData).map((m: string) =>
      parseFloat(m.split(" ")[0]),
    );
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc: number, curr: number) => acc + curr, 0) /
      memoryArray.length
    );
  };

  const calculateAverageTime = (timeData: string | null | undefined) => {
    const timeArray = safeParse(timeData).map((t: string) =>
      parseFloat(t.split(" ")[0]),
    );
    if (timeArray.length === 0) return 0;
    return (
      timeArray.reduce((acc: number, curr: number) => acc + curr, 0) /
      timeArray.length
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="size-6 animate-spin text-zinc-600" />
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-black border border-zinc-800 rounded-none">
        <p className="text-zinc-600 text-sm font-medium">
          No submission history found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => {
        const avgMemory = calculateAverageMemory(submission.memory);
        const avgTime = calculateAverageTime(submission.time);
        const isAccepted = submission.status === "Accepted";

        return (
          <div
            key={submission.id}
            onClick={() => onSubmissionClick?.(submission)}
            className="group relative bg-[#0d0d0d] border border-zinc-800 hover:border-zinc-700 p-4 rounded-none cursor-pointer transition-none shadow-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  {isAccepted ? (
                    <CheckCircle2 className="size-5 text-emerald-500" />
                  ) : (
                    <XCircle className="size-5 text-rose-500" />
                  )}
                  <div className="space-y-0.5">
                    <p
                      className={`text-sm font-bold tracking-tight ${isAccepted ? "text-emerald-500" : "text-rose-500"}`}
                    >
                      {submission.status}
                    </p>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                      {submission.language}
                    </p>
                  </div>
                </div>

                <div className="h-8 w-px bg-zinc-800 hidden md:block" />

                <div className="hidden md:flex items-center gap-6 text-zinc-500">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                      Runtime
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                      <Clock className="size-3" />
                      {avgTime.toFixed(3)}s
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                      Memory
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                      <Memory className="size-3" />
                      {avgMemory.toFixed(0)}KB
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right space-y-0.5 hidden sm:block">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    Submitted
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                    <Calendar className="size-3" />
                    {new Date(submission.createdAt || "").toLocaleDateString()}
                  </div>
                </div>
                <ChevronRight className="size-4 text-zinc-700 group-hover:text-zinc-400 transition-none" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionsList;
