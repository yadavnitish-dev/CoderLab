
import React from "react";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Problem {
  description: string;
  examples?: Record<string, Example> | Example[];
  testcases?: { input: string; output: string }[];
  constraints?: string;
}

interface ProblemDescriptionProps {
  problem: Problem;
  initialSampleCases: Example[];
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem, initialSampleCases }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <p className="text-zinc-300 text-[15px] leading-relaxed whitespace-pre-wrap">
          {problem.description}
        </p>
      </div>

      {initialSampleCases.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
            Sample Cases
          </h3>
          {initialSampleCases.map((example, index) => (
            <div
              key={index}
              className="bg-black border border-zinc-800 rounded-sm overflow-hidden"
            >
              <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/40 flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                  Case {index + 1}
                </span>
              </div>
              <div className="p-4 space-y-4 font-mono text-sm">
                <div>
                  <div className="text-[11px] text-zinc-500 mb-1.5 font-sans font-bold uppercase tracking-wider">
                    Input
                  </div>
                  <pre className="bg-black border border-zinc-900 p-3 rounded-sm text-zinc-300 overflow-x-auto">
                    {example.input}
                  </pre>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500 mb-1.5 font-sans font-bold uppercase tracking-wider">
                    Output
                  </div>
                  <pre className="bg-black border border-zinc-900 p-3 rounded-sm text-emerald-400/80 overflow-x-auto">
                    {example.output}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {problem.constraints && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
            Constraints
          </h3>
          <div className="bg-black border border-zinc-800 rounded-sm p-4">
            <code className="text-zinc-400 text-sm leading-relaxed">
              {problem.constraints}
            </code>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemDescription;
