
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  FileText,
  Lightbulb,
  GripVertical,
  Code2,
  XCircle,
} from "lucide-react";
import {  useParams, useNavigate } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { useAuthStore } from "../store/useAuthStore";
import SubmissionsList from "../components/SubmissionList";
import SubmissionResults from "../components/Submission";
import WorkspaceHeader from "../components/Problem/WorkspaceHeader";
import ProblemDescription from "../components/Problem/ProblemDescription";
import CodeEditor from "../components/Problem/CodeEditor";
import Skeleton, { SkeletonWorkspace } from "../components/Skeleton";
import SubmissionConsole from "../components/Problem/SubmissionConsole";

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
  const { getProblemById, problem, isProblemLoading, problems, getAllProblems } = useProblemStore();
  const { authUser } = useAuthStore();

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
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);

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
    if (problems.length === 0) {
      getAllProblems();
    }
  }, [id, getProblemById, getSubmissionCountForProblem, problems.length, getAllProblems]);

  useEffect(() => {
    if (problem) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    if (!id || problems.length === 0) return null;
    
    // Find the current problem's index in the list
    const currentIndex = problems.findIndex((p) => p.id === id);
    
    // If not found or it's the last one, return null
    if (currentIndex === -1 || currentIndex === problems.length - 1) return null;
    
    return problems[currentIndex + 1].id;
  }, [id, problems]);

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
      <div className="h-screen bg-[#0a0a0a] p-6">
        <SkeletonWorkspace />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <ProblemDescription 
            problem={problem} 
            initialSampleCases={initialSampleCases} 
          />
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
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
              Problem Hints
            </h3>
            {problem?.hints ? (
              <div className="bg-black border border-zinc-800 rounded-sm p-4">
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {problem.hints}
                </p>
              </div>
            ) : (
              <p className="text-zinc-500 italic text-sm">
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
      <WorkspaceHeader
        title={problem.title}
        difficulty={problem.difficulty}
        fontSize={fontSize}
        setFontSize={setFontSize}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={(lang) => {
          if (code !== "" && code !== (problem?.codeSnippets?.[selectedLanguage] || "")) {
            setPendingLanguage(lang);
          } else {
            setSelectedLanguage(lang);
            if (problem?.codeSnippets) {
              setCode(problem.codeSnippets[lang] || "");
            }
          }
        }}
        codeSnippets={problem.codeSnippets || {}}
        isLeftPaneVisible={isLeftPaneVisible}
        setIsLeftPaneVisible={setIsLeftPaneVisible}
        getDisplayLanguage={getDisplayLanguage}
        problemId={id || undefined}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 flex overflow-hidden p-2 relative">
        {/* Left Pane - Context */}
        {isLeftPaneVisible && (
          <div
            style={{ width: `${leftPaneWidth}%` }}
            className="flex flex-col bg-black border border-zinc-800 rounded-none overflow-hidden"
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
                      : "text-zinc-400 border-transparent hover:text-zinc-300 hover:bg-zinc-800"
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
            <div className="absolute bg-zinc-950 border border-zinc-800 p-1 rounded-none">
              <GripVertical className="size-3 text-zinc-400" />
            </div>
          </div>
        )}

        <div
          style={{
            width: isLeftPaneVisible ? `${100 - leftPaneWidth}%` : "100%",
          }}
          className="flex flex-col gap-2 relative"
        >
          <CodeEditor
            selectedLanguage={selectedLanguage}
            code={code}
            setCode={setCode}
            fontSize={fontSize}
            isResizing={isResizing}
          />

          <SubmissionConsole
            isConsoleOpen={isConsoleOpen}
            setIsConsoleOpen={setIsConsoleOpen}
            consoleTab={consoleTab}
            setConsoleTab={setConsoleTab}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            handleRunCode={handleRunCode}
            handleSubmit={handleSubmit}
            handleNextChallenge={handleNextChallenge}
            nextProblemId={nextProblemId}
            authUser={authUser}
            userTestCases={userTestCases}
            setUserTestCases={setUserTestCases}
            submission={submission}
          />
        </div>
      </main>

      {/* Language Switch Confirmation */}
      {pendingLanguage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-zinc-800 p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">
              Unsaved Changes
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              Switching languages will reset your code. Are you sure you want to continue?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setPendingLanguage(null)}
                className="flex-1 px-4 py-2 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const lang = pendingLanguage;
                  setPendingLanguage(null);
                  setSelectedLanguage(lang);
                  if (problem?.codeSnippets) {
                    setCode(problem.codeSnippets[lang] || "");
                  }
                }}
                className="flex-1 px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
              >
                Switch Language
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Details */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-none w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-none transition-colors"
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
