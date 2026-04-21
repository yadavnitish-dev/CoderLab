
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  Lightbulb,
  Clock,
  Code2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Type,
  Plus,
  Minus,
  GripVertical,
  ChevronRight,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import SubmissionsList from "../components/SubmissionList";
import SubmissionResults from "../components/Submission";
import BrutalistSelect from "../components/BrutalistSelect";

const displayLanguageMap: Record<string, string> = {
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  JAVA: "Java",
  CPP: "C++",
};

const getDisplayLanguage = (lang: string) => displayLanguageMap[lang] || lang;

const ProblemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleTab, setConsoleTab] = useState<"testcases" | "results">(
    "testcases",
  );
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  // Layout & Micro-interactions
  const [isLeftPaneVisible, setIsLeftPaneVisible] = useState(true);
  const [leftPaneWidth, setLeftPaneWidth] = useState(50); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [userTestCases, setUserTestCases] = useState<
    { input: string; output: string }[]
  >([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const { executeCode, submission, isRunning, isSubmitting } =
    useExecutionStore();

  const initialSampleCases = useMemo(() => {
    const selectedExample = problem?.examples?.[selectedLanguage];
    return selectedExample
      ? [selectedExample]
      : problem?.testcases?.slice(0, 1).map((testcase) => ({
          input: testcase.input,
          output: testcase.output,
          explanation: "",
        })) || [];
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (!id) return;
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id, getProblemById, getSubmissionCountForProblem]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] ||
          "",
      );
      const cases =
        problem.testcases?.slice(0, 2).map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || [];
      setUserTestCases(cases);
    }
    // We only want to initialize code when problem or language changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id, getSubmissionForProblem]);

  // Resizing Logic
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newWidth = (e.clientX / containerWidth) * 100;
        if (newWidth > 20 && newWidth < 70) {
          setLeftPaneWidth(newWidth);
        }
      }
    },
    [isResizing],
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);



  const handleRunCode = useCallback(() => {
    if (!problem || !id || isRunning || isSubmitting) return;
    const language_id = getLanguageId(selectedLanguage);
    if (!language_id) return;

    const stdin =
      userTestCases.length > 0
        ? userTestCases.map((tc) => tc.input)
        : initialSampleCases.map((tc) => tc.input);
    const expected_outputs =
      userTestCases.length > 0
        ? userTestCases.map((tc) => tc.output)
        : initialSampleCases.map((tc) => tc.output);

    executeCode(code, language_id, stdin, expected_outputs, id, "run");
    setIsConsoleOpen(true);
    setConsoleTab("results");
  }, [
    problem,
    id,
    isRunning,
    isSubmitting,
    selectedLanguage,
    code,
    userTestCases,
    initialSampleCases,
    executeCode,
  ]);

  const nextProblemId = useMemo(() => {
    if (!id || !id.startsWith('NC_')) return null;
    const currentNum = parseInt(id.split('_')[1]);
    const nextNum = currentNum + 1;
    const nextId = `NC_${nextNum}`;
    
    // Check if next ID exists in our samples or overall dataset
    // For now, we only know about samples NC_1 to NC_5 in frontend
    // but in a real app, we'd check the store/database
    return nextNum <= 150 ? nextId : null;
  }, [id]);

  const handleNextChallenge = useCallback(() => {
    if (nextProblemId) {
      navigate(`/problem/${nextProblemId}`);
    }
  }, [nextProblemId, navigate]);

  const handleSubmit = useCallback(() => {
    if (!problem || !id || isRunning || isSubmitting) return;
    const language_id = getLanguageId(selectedLanguage);
    if (!language_id) return;
    const stdin = problem.testcases?.map((tc) => tc.input) || [];
    const expected_outputs = problem.testcases?.map((tc) => tc.output) || [];
    executeCode(code, language_id, stdin, expected_outputs, id, "submit");
    setIsConsoleOpen(true);
    setConsoleTab("results");
  }, [
    problem,
    id,
    isRunning,
    isSubmitting,
    selectedLanguage,
    code,
    executeCode,
  ]);

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <Loader2 className="size-8 animate-spin text-zinc-600" />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
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
      case "submissions":
        return (
          <div className="animate-in fade-in duration-500">
            <SubmissionsList
              submissions={submissions}
              isLoading={isSubmissionsLoading}
              onSubmissionClick={(sub) => setSelectedSubmission(sub)}
            />
          </div>
        );
      case "hints":
        return (
          <div className="space-y-4 animate-in fade-in duration-500">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
              Problem Hints
            </h3>
            {problem?.hints ? (
              <div className="bg-black border border-zinc-800 rounded-sm p-4">
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {problem.hints}
                </p>
              </div>
            ) : (
              <p className="text-zinc-600 italic text-sm">
                No hints available for this challenge.
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden"
      ref={containerRef}
    >
      {/* Workspace Header */}
      <header className="h-14 border-b border-zinc-800 bg-[#0d0d0d] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/roadmap"
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm transition-all border border-transparent hover:border-zinc-700"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <h1 className="text-sm font-semibold text-zinc-200 truncate flex items-center gap-2">
            {problem.title}
            <span
              className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-tighter ${
                problem.difficulty === "Easy"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : problem.difficulty === "Medium"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-rose-500/10 text-rose-500"
              }`}
            >
              {problem.difficulty}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-black border border-zinc-800 rounded-sm p-1">
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
              className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm transition-all"
            >
              <Minus className="size-3" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              <Type className="size-3 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-400 w-4 text-center">
                {fontSize}
              </span>
            </div>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
              className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm transition-all"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          <BrutalistSelect
            className="min-w-35"
            icon={Code2}
            value={selectedLanguage}
            onChange={(val) => {
              setSelectedLanguage(val);
              if (problem?.codeSnippets) {
                setCode(problem.codeSnippets[val] || "");
              }
            }}
            options={Object.keys(problem.codeSnippets || {}).map((lang) => ({
              value: lang,
              label: getDisplayLanguage(lang),
            }))}
          />

          <button
            onClick={() => setIsLeftPaneVisible(!isLeftPaneVisible)}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm transition-all border border-transparent hover:border-zinc-700"
          >
            {isLeftPaneVisible ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeftOpen className="size-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 flex overflow-hidden p-2 relative">
        {/* Left Pane - Context */}
        {isLeftPaneVisible && (
          <div
            style={{ width: `${leftPaneWidth}%` }}
            className="flex flex-col bg-black border border-zinc-800 rounded-sm overflow-hidden"
          >
            <div className="flex items-center gap-1 p-1 bg-[#111] border-b border-zinc-800 shrink-0">
              {[
                { id: "description", icon: FileText, label: "Description" },
                { id: "submissions", icon: Code2, label: "Submissions" },
                { id: "hints", icon: Lightbulb, label: "Hints" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 border transition-all duration-300 relative ${
                    activeTab === tab.id
                      ? "text-white bg-zinc-900 border-zinc-700 z-10"
                      : "text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <tab.icon className="size-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {renderTabContent()}
            </div>
          </div>
        )}

        {/* Resizable Divider */}
        {isLeftPaneVisible && (
          <div
            onMouseDown={startResizing}
            className="w-2 hover:w-2 group cursor-col-resize flex items-center justify-center transition-all"
          >
            <div className="w-1px h-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors" />
            <div className="absolute bg-zinc-950 border border-zinc-800 p-1 rounded-sm">
              <GripVertical className="size-3 text-zinc-500" />
            </div>
          </div>
        )}

        {/* Right Pane - Editor & Console */}
        <div
          style={{
            width: isLeftPaneVisible ? `${100 - leftPaneWidth}%` : "100%",
          }}
          className="flex flex-col gap-2 relative"
        >
          {/* Prevent editor interaction while resizing */}
          {isResizing && (
            <div className="absolute inset-0 z-50 cursor-col-resize" />
          )}

          <div className="flex-1 bg-black border border-zinc-800 rounded-sm overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 bg-[#111] border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Code2 className="size-3.5 text-zinc-500" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Main.
                  {selectedLanguage.toLowerCase().includes("python")
                    ? "py"
                    : "ts"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3" />
                  <span>Auto-saving</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={selectedLanguage.toLowerCase()}
                theme="tokyo-drift"
                value={code}
                onChange={(v) => setCode(v || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: fontSize,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  padding: { top: 20 },
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
            </div>
          </div>

          {/* Action Bar & Console */}
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
                  disabled={isRunning || isSubmitting}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-bold text-zinc-400 hover:text-white border border-zinc-800 bg-black hover:bg-zinc-900 transition-all disabled:opacity-30"
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
                  disabled={isRunning || isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-1.5 rounded-sm text-xs font-bold bg-white text-black hover:bg-zinc-200 transition-all disabled:opacity-30 min-w-20"
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
                    className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${consoleTab === "testcases" ? "border-white text-white" : "border-transparent text-zinc-600 hover:text-zinc-400"}`}
                  >
                    Test Cases
                  </button>
                  <button
                    onClick={() => setConsoleTab("results")}
                    className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${consoleTab === "results" ? "border-white text-white" : "border-transparent text-zinc-600 hover:text-zinc-400"}`}
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
                            className={`flex items-center gap-2 text-sm font-bold ${submission.status === "Accepted" ? "text-emerald-500" : "text-rose-500"}`}
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
                                  className={`bg-black border border-zinc-900 p-3 rounded-sm text-xs font-mono whitespace-pre-wrap ${key !== "stdout" ? "text-rose-400/80" : "text-zinc-300"}`}
                                >
                                  {(() => {
                                    try {
                                      const p = JSON.parse(val);
                                      return Array.isArray(p)
                                        ? p.join("\n")
                                        : val;
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
        </div>
      </main>

      {/* Submission Details */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-100 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-sm w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 shadow-2xl">
            <button
              className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-white hover:bg-zinc-900 rounded-sm transition-all"
              onClick={() => setSelectedSubmission(null)}
            >
              <XCircle className="size-6" />
            </button>
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Submission Details
              </h3>
              <SubmissionResults submission={selectedSubmission} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;
