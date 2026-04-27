import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Zap,
  BarChart3,
} from "lucide-react";
import { Submission as SubmissionType } from "../types";

interface SubmissionResultsProps {
  submission: SubmissionType & {
    testCases: Array<{
      id: string;
      passed: boolean;
      expected: string;
      stdout: string | null;
      memory: number;
      time: number;
    }>;
    memory: string;
    time: string;
  };
}

const SubmissionResults: React.FC<SubmissionResultsProps> = ({
  submission,
}) => {
  const memoryArr = JSON.parse(submission.memory || "[]");
  const timeArr = JSON.parse(submission.time || "[]");

  const avgMemory =
    memoryArr.length > 0
      ? memoryArr
          .map((m: string) => parseFloat(m))
          .reduce((a: number, b: number) => a + b, 0) / memoryArr.length
      : 0;

  const avgTime =
    timeArr.length > 0
      ? timeArr
          .map((t: string) => parseFloat(t))
          .reduce((a: number, b: number) => a + b, 0) / timeArr.length
      : 0;

  const passedTests = submission.testCases.filter((tc) => tc.passed).length;
  const totalTests = submission.testCases.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Status",
            value: submission.status,
            icon: Zap,
            color:
              submission.status === "Accepted"
                ? "text-emerald-500"
                : "text-rose-500",
          },
          {
            label: "Success Rate",
            value: `${successRate.toFixed(1)}%`,
            icon: BarChart3,
            color: "text-zinc-200",
          },
          {
            label: "Avg Runtime",
            value: `${avgTime.toFixed(3)}s`,
            icon: Clock,
            color: "text-zinc-200",
          },
          {
            label: "Avg Memory",
            value: `${avgMemory.toFixed(0)}KB`,
            icon: Memory,
            color: "text-zinc-200",
          },
        ].map((metric, i) => (
          <div
            key={i}
            className="bg-black border border-zinc-800 p-5 rounded-none relative overflow-hidden group shadow-none"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <metric.icon className="size-12" />
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
              {metric.label}
            </p>
            <p className={`text-xl font-bold ${metric.color}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Results Table */}
      <div className="bg-black border border-zinc-800 rounded-none overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/30">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Test Case Breakdown
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/10">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Result
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Expected
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Actual
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Resource
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {submission.testCases.map((testCase, _i) => (
                <tr
                  key={testCase.id}
                  className="group hover:bg-zinc-900 transition-none"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {testCase.passed ? (
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      ) : (
                        <XCircle className="size-4 text-rose-500" />
                      )}
                      <span
                        className={`text-xs font-bold uppercase tracking-tighter ${testCase.passed ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {testCase.passed ? "Passed" : "Failed"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                    {testCase.expected}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-zinc-200">
                    {testCase.stdout || "—"}
                  </td>
                  <td className="px-6 py-4 text-[11px] text-zinc-400 font-medium">
                    {testCase.time}s • {testCase.memory}KB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;
