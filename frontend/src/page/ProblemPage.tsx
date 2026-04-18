import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Clock,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import SubmissionsList from "../components/SubmissionList";
import SubmissionResults from "../components/Submission";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const { executeCode, submission, isRunning, isSubmitting } = useExecutionStore();
  const selectedExample = problem?.examples?.[selectedLanguage];
  const sampleCases = selectedExample
    ? [selectedExample]
    : problem?.testcases?.slice(0, 1).map((testcase) => ({
        input: testcase.input,
        output: testcase.output,
        explanation: "",
      })) || [];

  useEffect(() => {
    if (!id) return;
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || ""
      );

    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    if (problem?.codeSnippets) {
      setCode(problem.codeSnippets[lang] || "");
    }
  };

  const handleRunCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!problem || !id) return;
    try {
      const language_id = getLanguageId(selectedLanguage);
      if (!language_id) return;
      const stdin = sampleCases.map((tc) => tc.input);
      const expected_outputs = sampleCases.map((tc) => tc.output);
      if (stdin.length === 0) return;
      executeCode(code, language_id, stdin, expected_outputs, id, "run");
      setIsConsoleOpen(true);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!problem || !id) return;
    try {
      const language_id = getLanguageId(selectedLanguage);
      if (!language_id) return;
      const stdin = problem.testcases?.map((tc) => tc.input) || [];
      const expected_outputs = problem.testcases?.map((tc) => tc.output) || [];
      executeCode(code, language_id, stdin, expected_outputs, id, "submit");
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>

            {sampleCases.length > 0 && (
              <>
                <h3 className="text-xl font-bold mb-4">Sample Testcases:</h3>
                {sampleCases.map((example, index) => (
                  <div
                    key={`${selectedLanguage}-${index}`}
                    className="bg-base-200 p-6 rounded-xl mb-6 font-mono"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-base-content/70">
                        Sample #{index + 1}
                      </span>
                      {selectedExample && (
                        <span className="badge badge-outline badge-sm">
                          {selectedLanguage}
                        </span>
                      )}
                    </div>
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 text-base font-semibold">
                        Input:
                      </div>
                      <pre className="bg-black/90 px-4 py-3 rounded-lg font-semibold text-white whitespace-pre-wrap">
                        {example.input}
                      </pre>
                    </div>
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 text-base font-semibold">
                        Output:
                      </div>
                      <pre className="bg-black/90 px-4 py-3 rounded-lg font-semibold text-white whitespace-pre-wrap">
                        {example.output}
                      </pre>
                    </div>
                    {example.explanation && (
                      <div>
                        <div className="text-emerald-300 mb-2 text-base font-semibold">
                          Explanation:
                        </div>
                        <p className="text-base-content/70 text-lg">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl mb-6">
                  <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
            // @ts-ignore
            onSubmissionClick={(submission) => setSelectedSubmission(submission)}
          />
        );
      case "discussion":
        return (
          <div className="p-4 text-center text-base-content/70">
            No discussions yet
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">
                No hints available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Custom Navbar for Problem Page */}
      <div className="w-full pt-4 px-4 sticky top-0 z-40">
        <nav className="glass-panel p-3 mb-6 flex justify-between items-center rounded-2xl mx-auto max-w-[1600px]">
        <div className="flex-1 gap-4 flex items-center">
          <Link to={"/"} className="btn btn-circle btn-ghost btn-sm hover:bg-white/10 text-primary">
            <Home className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-white/10 mx-1"></div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-3 text-white">
                {problem.title} 
                <span className="badge badge-primary badge-outline text-xs">{problem.difficulty}</span>
            </h1>
          </div>
        </div>
        <div className="flex-none flex items-center gap-3">
            <div className="flex items-center gap-4 text-xs font-semibold text-base-content/50 mr-4 bg-base-300/30 px-3 py-1.5 rounded-lg border border-white/5">
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Updated {new Date(problem.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="w-1 h-1 bg-current rounded-full opacity-30"></div>
                <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{submissionCount} Submissions</span>
                </div>
                <div className="w-1 h-1 bg-current rounded-full opacity-30"></div>
                <div className="flex items-center gap-1.5">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>95% Like</span>
                </div>
            </div>

          <button
            className={`btn btn-circle btn-sm ${
              isBookmarked ? "btn-primary" : "btn-ghost text-base-content/60"
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <select
            className="select select-bordered select-sm w-36 bg-base-200/50 focus:bg-base-200"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>
      </div>
      <div className="px-4 w-full">
         <div className="max-w-[1600px] mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
        {/* Left Panel: Description & Submissions */}
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full border border-white/5">
            <div className="tabs tabs-boxed bg-transparent p-2 border-b border-white/5">
              <button
                className={`tab tab-sm h-10 px-6 rounded-lg transition-all ${
                  activeTab === "description" ? "bg-primary text-primary-content shadow-lg shadow-primary/20" : "hover:bg-white/5"
                }`}
                onClick={() => setActiveTab("description")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Description
              </button>
              <button
                className={`tab tab-sm h-10 px-6 rounded-lg transition-all ${
                  activeTab === "submissions" ? "bg-primary text-primary-content shadow-lg shadow-primary/20" : "hover:bg-white/5"
                }`}
                onClick={() => setActiveTab("submissions")}
              >
                <Code2 className="w-4 h-4 mr-2" />
                Submissions
              </button>
              <button
                className={`tab tab-sm h-10 px-6 rounded-lg transition-all ${
                  activeTab === "discussion" ? "bg-primary text-primary-content shadow-lg shadow-primary/20" : "hover:bg-white/5"
                }`}
                onClick={() => setActiveTab("discussion")}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Discuss
              </button>
              <button
                className={`tab tab-sm h-10 px-6 rounded-lg transition-all ${
                    activeTab === "hints" ? "bg-primary text-primary-content shadow-lg shadow-primary/20" : "hover:bg-white/5"
                }`}
                onClick={() => setActiveTab("hints")}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Hints
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
                {renderTabContent()}
            </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="flex flex-col gap-4 h-full">
            <div className="glass-panel flex-1 rounded-2xl overflow-hidden flex flex-col border border-white/5 relative group">
                <div className="bg-base-300/30 backdrop-blur-md px-4 py-2 border-b border-white/5 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-mono text-base-content/60">
                        main.{
                            selectedLanguage.toLowerCase() === 'python' ? 'py' :
                            selectedLanguage.toLowerCase() === 'java' ? 'java' :
                            selectedLanguage.toLowerCase() === 'typescript' ? 'ts' :
                            'js'
                        }
                    </span>
                </div>
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        language={selectedLanguage.toLowerCase()}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: "on",
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            readOnly: false,
                            automaticLayout: true,
                            padding: { top: 16 },
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    />
                </div>
            </div>

            {/* Action Bar & Test Cases */}
            <div className="glass-panel rounded-2xl p-4 border border-white/5">
                 {/* Only show test cases area if not submitted yet or minimal view */}
                 <div className="flex justify-between items-center">
                   <div className="flex gap-2">
                        <button 
                             className="btn btn-sm btn-ghost gap-2 text-base-content/70 hover:bg-base-content/10"
                             onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                        >
                             <Terminal className="w-4 h-4" />
                             Console
                             <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isConsoleOpen ? "rotate-90" : ""}`} />
                        </button>
                   </div>
                   <div className="flex gap-3">
                      <button
                        className={`btn btn-sm btn-secondary/20 text-secondary hover:bg-secondary/30 gap-2 ${
                            isRunning ? "loading" : ""
                        }`}
                        onClick={handleRunCode}
                        disabled={isRunning || isSubmitting}
                      >
                        {!isRunning && <Play className="w-4 h-4" />}
                        Run
                      </button>
                      <button
                        className="btn btn-sm btn-primary shadow-lg shadow-primary/20 gap-2 px-6"
                        onClick={handleSubmit}
                        disabled={isRunning || isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            <>Submit</>
                        )}
                      </button>
                   </div>
                </div>
                                  {isConsoleOpen && (
                     <div className="mt-4 border-t border-white/5 pt-4 animate-in slide-in-from-bottom-2 duration-200">
                         <div className="flex items-center justify-between mb-3">
                             <span className="text-xs font-semibold uppercase tracking-wider text-base-content/50">Test Results</span>
                         </div>
                         <div className="bg-black/30 rounded-xl p-4 font-mono text-sm h-48 overflow-y-auto custom-scrollbar">
                            {submission ? (
                                <div className="space-y-4">
                                    <div className={`flex items-center gap-2 ${submission.status === "Accepted" ? "text-success" : "text-error"}`}>
                                        {submission.status === "Accepted" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        <span className="font-semibold">{submission.status}</span>
                                    </div>
                                    
                                    {submission.compileOutput && (
                                        <div className="bg-base-100/50 p-3 rounded-lg border border-red-500/20 text-red-400">
                                            <div className="text-xs opacity-50 mb-1">Compilation Error:</div>
                                            <pre className="whitespace-pre-wrap">
                                                {(() => {
                                                    try {
                                                        const parsed = JSON.parse(submission.compileOutput);
                                                        return Array.isArray(parsed) ? parsed.join('\n') : submission.compileOutput;
                                                    } catch {
                                                        return submission.compileOutput;
                                                    }
                                                })()}
                                            </pre>
                                        </div>
                                    )}
                                    
                                    {submission.stdout && (
                                        <div className="bg-base-100/50 p-3 rounded-lg border border-white/5">
                                            <div className="text-xs opacity-50 mb-1">Output:</div>
                                            <pre className="whitespace-pre-wrap">
                                                {(() => {
                                                    try {
                                                        const parsed = JSON.parse(submission.stdout);
                                                        return Array.isArray(parsed) ? parsed.join('\n') : submission.stdout;
                                                    } catch {
                                                        return submission.stdout;
                                                    }
                                                })()}
                                            </pre>
                                        </div>
                                    )}

                                    {submission.stderr && (
                                         <div className="bg-base-100/50 p-3 rounded-lg border border-red-500/20 text-red-400">
                                             <div className="text-xs opacity-50 mb-1">Standard Error:</div>
                                            <pre className="whitespace-pre-wrap">
                                                {(() => {
                                                    try {
                                                        const parsed = JSON.parse(submission.stderr);
                                                        return Array.isArray(parsed) ? parsed.join('\n') : submission.stderr;
                                                    } catch {
                                                        return submission.stderr;
                                                    }
                                                })()}
                                            </pre>
                                         </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-base-content/40 italic text-center py-10">
                                    Run your code to see results here
                                </div>
                            )}
                         </div>
                     </div>
                  )}
            </div>
            </div>
        </div>
      </div>
      </div>

    
    {/* Submission Details Modal */}
      {selectedSubmission && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl bg-base-100">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setSelectedSubmission(null)}
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-4">Submission Details</h3>
            <SubmissionResults submission={selectedSubmission} />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedSubmission(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default ProblemPage;
