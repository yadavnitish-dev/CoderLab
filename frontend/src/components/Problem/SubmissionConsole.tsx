
import React from "react";
import {
  Code2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Play,
  ChevronRight,
  Plus,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface SubmissionConsoleProps {
  isConsoleOpen: boolean;
  setIsConsoleOpen: (open: boolean) => void;
  consoleTab: "testcases" | "results";
  setConsoleTab: (tab: "testcases" | "results") => void;
  isRunning: boolean;
  isSubmitting: boolean;
  handleRunCode: () => void;
  handleSubmit: () => void;
  handleNextChallenge: () => void;
  nextProblemId: string | null;
  authUser: any;
  userTestCases: { input: string; output: string }[];
  setUserTestCases: (cases: { input: string; output: string }[]) => void;
  submission: any;
}

const SubmissionConsole: React.FC<SubmissionConsoleProps> = ({
  isConsoleOpen,
  setIsConsoleOpen,
  consoleTab,
  setConsoleTab,
  isRunning,
  isSubmitting,
  handleRunCode,
  handleSubmit,
  handleNextChallenge,
  nextProblemId,
  authUser,
  userTestCases,
  setUserTestCases,
  submission,
}) => {
  return (
    <div className="bg-[#090909] border border-zinc-800 rounded-sm shrink-0 transition-all">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-bold text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-800"
          >
            <Code2 className="size-3.5" />
            Console
            {isConsoleOpen ? (
              <ChevronDown className="size-3" />
            ) : (
              <ChevronUp className="size-3" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting || !authUser?.isVerified}
            title={!authUser?.isVerified ? "Verify your email to run code" : ""}
            className="flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-bold text-zinc-400 hover:text-white border border-zinc-800 bg-black hover:bg-zinc-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Play className="size-3.5" />
            )}
            Run
          </button>

          {nextProblemId && (
            <button
              onClick={handleNextChallenge}
              className="flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-bold text-zinc-500 hover:text-white border border-zinc-800 bg-black hover:bg-zinc-900 transition-all group"
            >
              Next Challenge
              <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting || !authUser?.isVerified}
            title={!authUser?.isVerified ? "Verify your email to submit code" : ""}
            className="flex items-center justify-center gap-2 px-6 py-1.5 rounded-sm text-xs font-bold bg-white text-black hover:bg-zinc-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed min-w-20"
          >
            {isSubmitting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>

      {isConsoleOpen && (
        <div className="border-t border-zinc-800 flex flex-col h-72 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-4 px-4 border-b border-zinc-800 shrink-0">
            <button
              onClick={() => setConsoleTab("testcases")}
              className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${
                consoleTab === "testcases"
                  ? "border-white text-white"
                  : "border-transparent text-zinc-600 hover:text-zinc-400"
              }`}
            >
              Test Cases
            </button>
            <button
              onClick={() => setConsoleTab("results")}
              className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${
                consoleTab === "results"
                  ? "border-white text-white"
                  : "border-transparent text-zinc-600 hover:text-zinc-400"
              }`}
            >
              Results
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {consoleTab === "testcases" ? (
              <div className="space-y-4">
                {userTestCases.map((tc, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                      Test Case {idx + 1}
                    </p>
                    <textarea
                      value={tc.input}
                      onChange={(e) => {
                        const newCases = [...userTestCases];
                        newCases[idx] = {
                          ...newCases[idx],
                          input: e.target.value,
                        };
                        setUserTestCases(newCases);
                      }}
                      className="w-full bg-black border border-zinc-900 shadow-inner rounded-sm p-3 text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-700 min-h-20 resize-none"
                      placeholder="Enter stdin..."
                    />
                  </div>
                ))}
                <button
                  onClick={() =>
                    setUserTestCases([
                      ...userTestCases,
                      { input: "", output: "" },
                    ])
                  }
                  className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2"
                >
                  <Plus className="size-3" /> Add Test Case
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {isRunning || isSubmitting ? (
                  <div className="flex flex-col items-center justify-center py-[6.4rem] gap-6 animate-in fade-in duration-500">
                    <div className="relative">
                      <div className="size-14 border border-zinc-800 rounded-sm animate-spin [animation-duration:3s]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                      </div>
                    </div>
                    <div className="text-center space-y-1.5">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] animate-pulse">
                        Runtime Engine Active
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="size-1 bg-zinc-800 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="size-1 bg-zinc-800 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="size-1 bg-zinc-800 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                ) : submission ? (
                  <div className="space-y-4">
                    <div
                      className={`flex items-center gap-2 text-sm font-bold ${
                        submission.status === "Accepted"
                          ? "text-emerald-500"
                          : "text-rose-500"
                      }`}
                    >
                      {submission.status === "Accepted" ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <XCircle className="size-4" />
                      )}
                      {submission.status}
                    </div>
                    {["compileOutput", "stdout", "stderr"].map((key) => {
                      const val = submission[
                        key as keyof typeof submission
                      ] as string | undefined;
                      if (!val) return null;
                      return (
                        <div key={key} className="space-y-1.5">
                          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                            {key === "stdout" ? "Output" : key}
                          </span>
                          <pre
                            className={`bg-black border border-zinc-900 p-3 rounded-sm text-xs font-mono whitespace-pre-wrap ${
                              key !== "stdout"
                                ? "text-rose-400/80"
                                : "text-zinc-300"
                            }`}
                          >
                            {(() => {
                              try {
                                const p = JSON.parse(val);
                                return Array.isArray(p) ? p.join("\n") : val;
                              } catch {
                                return val;
                              }
                            })()}
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-10 text-zinc-600">
                    <Code2 className="size-8 mb-2 opacity-20" />
                    <p className="text-sm italic">
                      No results yet. Run code to see output.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionConsole;
