import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Code2,
  Trash2,
  Plus,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
  Loader2,
} from "lucide-react";
import BrutalistSelect from "./BrutalistSelect";
import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { NC150_SAMPLES } from "../lib/nc150-samples";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z
    .array(z.object({ value: z.string() }))
    .min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      }),
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    CPP: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
    CPP: z.string().min(1, "C++ code snippet is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
    CPP: z.string().min(1, "C++ solution is required"),
  }),
});

const CreateProblemForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const [sampleType, setSampleType] = useState("NC_1");
  const navigation = useNavigate();

  type ProblemFormData = z.infer<typeof problemSchema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProblemFormData>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testcases: [{ input: "", output: "" }],
      tags: [{ value: "" }],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT:
          'const CASE_START = "__ALGOPREP_CASE_START__";\nconst CASE_END = "__ALGOPREP_CASE_END__";\n\nfunction solveCase(rawInput) {\n  // Parse one testcase from rawInput and return the output as a string\n  return "";\n}\n\nfunction parseBatchedInput(raw) {\n  const lines = raw.replace(/\\r\\n/g, "\\n").split("\\n");\n  let index = 0;\n  const totalCases = parseInt(lines[index++] || "0", 10);\n  const cases = [];\n\n  for (let i = 0; i < totalCases; i++) {\n    const lineCount = parseInt(lines[index++] || "0", 10);\n    cases.push(lines.slice(index, index + lineCount).join("\\n"));\n    index += lineCount;\n  }\n\n  return cases;\n}\n\nconst fs = require("fs");\nconst testcases = parseBatchedInput(fs.readFileSync(0, "utf8"));\nconst outputs = testcases.map((testcase) => String(solveCase(testcase)));\nprocess.stdout.write(\n  outputs.map((output) => `${CASE_START}\\n${output}\\n${CASE_END}`).join("\\n")\n);',
        PYTHON:
          'import sys\n\nCASE_START = "__ALGOPREP_CASE_START__"\nCASE_END = "__ALGOPREP_CASE_END__"\n\n\ndef solve_case(raw_input: str) -> str:\n    # Parse one testcase from raw_input and return the output as a string\n    return ""\n\n\ndef parse_batched_input(raw: str) -> list[str]:\n    lines = raw.replace("\\r\\n", "\\n").split("\\n")\n    index = 0\n    total_cases = int(lines[index] or "0")\n    index += 1\n    cases = []\n\n    for _ in range(total_cases):\n        line_count = int(lines[index] or "0")\n        index += 1\n        cases.append("\\n".join(lines[index:index + line_count]))\n        index += line_count\n\n    return cases\n\n\nif __name__ == "__main__":\n    raw = sys.stdin.read()\n    testcases = parse_batched_input(raw) if raw else []\n    outputs = [str(solve_case(testcase)) for testcase in testcases]\n    sys.stdout.write("\\n".join(f"{CASE_START}\\n{output}\\n{CASE_END}" for output in outputs))',
        JAVA: 'import java.io.BufferedReader;\nimport java.io.InputStreamReader;\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    private static final String CASE_START = "__ALGOPREP_CASE_START__";\n    private static final String CASE_END = "__ALGOPREP_CASE_END__";\n\n    private static String solveCase(String rawInput) {\n        // Parse one testcase from rawInput and return the output as a string\n        return "";\n    }\n\n    private static List<String> parseBatchedInput(BufferedReader reader) throws Exception {\n        List<String> cases = new ArrayList<>();\n        String totalLine = reader.readLine();\n        int totalCases = Integer.parseInt((totalLine == null ? "0" : totalLine).trim());\n\n        for (int i = 0; i < totalCases; i++) {\n            String countLine = reader.readLine();\n            int lineCount = Integer.parseInt((countLine == null ? "0" : countLine).trim());\n            StringBuilder currentCase = new StringBuilder();\n\n            for (int line = 0; line < lineCount; line++) {\n                String currentLine = reader.readLine();\n                if (currentLine == null) {\n                    currentLine = "";\n                }\n                currentCase.append(currentLine);\n                if (line < lineCount - 1) {\n                    currentCase.append("\\n");\n                }\n            }\n\n            cases.add(currentCase.toString());\n        }\n\n        return cases;\n    }\n\n    public static void main(String[] args) throws Exception {\n        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));\n        List<String> testcases = parseBatchedInput(reader);\n        StringBuilder output = new StringBuilder();\n\n        for (int i = 0; i < testcases.size(); i++) {\n            if (i > 0) {\n                output.append("\\n");\n            }\n            output.append(CASE_START).append("\\n");\n            output.append(solveCase(testcases.get(i))).append("\\n");\n            output.append(CASE_END);\n        }\n\n        System.out.print(output);\n    }\n}',
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });

  useEffect(() => {
    if (isEditing) {
      const fetchProblem = async () => {
        try {
          const res = await axiosInstance.get(`/problems/get-problem/${id}`);
          const problemData = res.data.problem;
          // Transform tags from string[] to {value: string}[]
          const formattedTags = problemData.tags.map((tag: string) => ({
            value: tag,
          }));
          reset({ ...problemData, tags: formattedTags });
        } catch (error) {
          console.error("Error fetching problem:", error);
          toast.error("Failed to load problem");
          navigation("/explore");
        }
      };
      fetchProblem();
    }
  }, [id, isEditing, reset, navigation]);

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replacetestcases,
  } = useFieldArray<ProblemFormData, "testcases">({
    control,
    name: "testcases",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray<ProblemFormData, "tags">({
    control,
    name: "tags",
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (value: ProblemFormData) => {
    try {
      setIsLoading(true);
      // Transform tags from {value: string}[] to string[] for API
      const formattedData = {
        ...value,
        tags: value.tags.map((tag) => tag.value), // Extract strings from objects
      };

      if (isEditing) {
        const res = await axiosInstance.put(
          `/problems/update-problem/${id}`,
          formattedData,
        );
        toast.success(res.data.message || "Problem Updated successfully⚡");
      } else {
        const res = await axiosInstance.post(
          "/problems/create-problem",
          formattedData,
        );
        toast.success(res.data.message || "Problem Created successfully⚡");
      }

      navigation("/explore");
    } catch (error) {
      console.log(error);
      toast.error(
        isEditing ? "Error updating problem" : "Error creating problem",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleDataMap: any = {
      ...NC150_SAMPLES
    };

    const sampleData = sampleDataMap[sampleType];
    if (!sampleData) return;

    const formattedTags = sampleData.tags.map((tag: string) => ({
      value: tag,
    }));
    
    replaceTags(formattedTags);
    replacetestcases(sampleData.testcases);

    // Reset the form with sample data
    reset({ 
      ...sampleData, 
      tags: formattedTags,
      codeSnippets: sampleData.codeSnippets,
      referenceSolutions: sampleData.referenceSolutions 
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-secondary/20 blur-[100px] rounded-full -z-10 opacity-30 pointer-events-none"></div>

      <div className="max-w-400 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0d0d0d] border border-zinc-800 p-6 md:p-8 relative z-10 rounded-sm shadow-2xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-white/5 gap-4">
              <div>
                <h2 className="text-3xl font-bold font-display tracking-tight text-white flex items-center gap-3">
                  <div className="p-2 rounded-sm bg-zinc-900 border border-zinc-800">
                    <FileText className="w-6 h-6 text-zinc-400" />
                  </div>
                  {isEditing ? "Edit Problem" : "Create New Problem"}
                </h2>
                <p className="text-base-content/60 mt-1 ml-1">
                  Contribute challenges to the community
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Select NeetCode Sample:</span>
                    <div className="join bg-black border border-zinc-800 rounded-sm p-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={`btn btn-xs border-0 rounded-sm w-12 ${
                            sampleType === `NC_${num}`
                              ? "bg-white text-black shadow-lg"
                              : "btn-ghost hover:bg-zinc-900 text-zinc-500"
                          }`}
                          onClick={() => setSampleType(`NC_${num}`)}
                        >
                          #{num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-ghost border border-zinc-800 hover:bg-zinc-900 gap-2 rounded-sm w-full md:w-fit"
                    onClick={loadSampleData}
                    disabled={!sampleType.startsWith('NC_')}
                  >
                    <Download className="w-4 h-4" />
                    Load NeetCode Configuration
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control md:col-span-2">
                  <label className="label pl-0">
                    <span className="label-text font-medium text-base-content/80">
                      Problem Title
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full bg-black border-zinc-800 focus:border-emerald-500/50 focus:bg-black transition-all rounded-sm ${errors.title ? "input-error" : ""}`}
                    {...register("title")}
                    placeholder="e.g. Two Sum"
                  />
                  {errors.title && (
                    <span className="text-error text-xs mt-1">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label pl-0">
                    <span className="label-text font-medium text-base-content/80">
                      Description
                    </span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered min-h-32 w-full bg-black border-zinc-800 focus:border-emerald-500/50 focus:bg-black transition-all text-base leading-relaxed rounded-sm ${errors.description ? "textarea-error" : ""}`}
                    {...register("description")}
                    placeholder="Describe the problem in detail..."
                  />
                  {errors.description && (
                    <span className="text-error text-xs mt-1">
                      {errors.description.message}
                    </span>
                  )}
                </div>

                  <Controller
                    name="difficulty"
                    control={control}
                    render={({ field }) => (
                      <BrutalistSelect
                        options={[
                          { value: "EASY", label: "Easy" },
                          { value: "MEDIUM", label: "Medium" },
                          { value: "HARD", label: "Hard" },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        className={errors.difficulty ? "border-rose-500/50" : ""}
                      />
                    )}
                  />
                  {errors.difficulty && (
                    <span className="text-error text-xs mt-1">
                      {errors.difficulty.message}
                    </span>
                  )}
              </div>

              {/* Tags Section */}
              <div className="bg-black rounded-sm p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                    <BookOpen className="w-5 h-5 text-secondary" />
                    Tags
                  </h3>
                  <button
                    type="button"
                    className="btn btn-xs btn-outline btn-secondary rounded-sm border-zinc-800 hover:border-zinc-700"
                    onClick={() => appendTag({ value: "" })}
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tagFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                      <input
                        type="text"
                        className="input input-sm input-bordered flex-1 bg-black border-zinc-800 focus:border-emerald-500/50 rounded-sm"
                        {...register(`tags.${index}.value`)}
                        placeholder="e.g. Array"
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs btn-square hover:bg-error/20 hover:text-error"
                        onClick={() => removeTag(index)}
                        disabled={tagFields.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.tags && (
                  <div className="mt-2 text-error text-sm">
                    {errors.tags.message}
                  </div>
                )}
              </div>

              {/* Test Cases Section */}
              <div className="bg-black rounded-sm p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Test Cases
                  </h3>
                  <button
                    type="button"
                    className="btn btn-xs btn-outline btn-success rounded-sm border-zinc-800 hover:border-zinc-700"
                    onClick={() => appendTestCase({ input: "", output: "" })}
                  >
                    <Plus className="w-3 h-3" /> Add Case
                  </button>
                </div>

                <div className="space-y-4">
                  {testCaseFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="bg-black rounded-sm p-4 border border-zinc-800 relative group"
                    >
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs btn-square absolute top-2 right-2 hover:bg-error/20 hover:text-error"
                        onClick={() => removeTestCase(index)}
                        disabled={testCaseFields.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <h4 className="text-xs font-mono text-base-content/50 mb-3 uppercase tracking-wider">
                        Case #{index + 1}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label pt-0">
                            <span className="label-text text-xs font-mono opacity-70">
                              Input
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered min-h-16 w-full bg-black border-zinc-800 font-mono text-sm leading-relaxed focus:border-emerald-500/50 rounded-sm"
                            {...register(`testcases.${index}.input`)}
                            placeholder="Input data..."
                          />
                          {errors.testcases?.[index]?.input && (
                            <span className="text-error text-xs mt-1">
                              {errors.testcases[index].input.message}
                            </span>
                          )}
                        </div>
                        <div className="form-control">
                          <label className="label pt-0">
                            <span className="label-text text-xs font-mono opacity-70">
                              Expected Output
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered min-h-16 w-full bg-black border-zinc-800 font-mono text-sm leading-relaxed focus:border-emerald-500/50 rounded-sm"
                            {...register(`testcases.${index}.output`)}
                            placeholder="Expected output..."
                          />
                          {errors.testcases?.[index]?.output && (
                            <span className="text-error text-xs mt-1">
                              {errors.testcases[index].output.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.testcases && !Array.isArray(errors.testcases) && (
                  <div className="mt-2 text-error text-sm">
                    {errors.testcases.message}
                  </div>
                )}
              </div>

              {/* Language Specific Sections */}
              <div className="space-y-6">
                {(["JAVASCRIPT", "PYTHON", "JAVA", "CPP"] as const).map((language) => (
                  <div
                    key={language}
                    className="collapse collapse-arrow bg-black border border-zinc-800 rounded-sm overflow-hidden"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={language === "JAVASCRIPT"}
                    />
                    <div className="collapse-title text-base font-semibold flex items-center gap-2 p-4">
                      <div
                        className={`w-8 h-8 rounded-sm flex items-center justify-center bg-zinc-900 border border-zinc-800`}
                      >
                        <Code2 className="w-4 h-4" />
                      </div>
                      {language} Configuration
                    </div>
                    <div className="collapse-content p-6 border-t border-white/5 space-y-6">
                      {/* Starter Code */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-base-content/80">
                          <Code2 className="w-4 h-4" /> Starter Code
                        </h4>
                        <div className="border border-white/10 rounded-lg overflow-hidden">
                          <Controller
                            name={`codeSnippets.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="200px"
                                language={language.toLowerCase()}
                                theme="tokyo-drift"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 13,
                                  lineNumbers: "on",
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                  padding: { top: 16, bottom: 16 },
                                  roundedSelection: false,
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.codeSnippets?.[language] && (
                          <div className="text-error text-xs mt-1">
                            {errors.codeSnippets[language].message}
                          </div>
                        )}
                      </div>

                      {/* Reference Solution */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-base-content/80">
                          <CheckCircle2 className="w-4 h-4 text-success" />{" "}
                          Valid Solution
                        </h4>
                        <div className="border border-white/10 rounded-lg overflow-hidden">
                          <Controller
                            name={`referenceSolutions.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="200px"
                                language={language.toLowerCase()}
                                theme="tokyo-drift"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 13,
                                  lineNumbers: "on",
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                  padding: { top: 16, bottom: 16 },
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.referenceSolutions?.[language] && (
                          <div className="text-error text-xs mt-1">
                            {errors.referenceSolutions[language].message}
                          </div>
                        )}
                      </div>

                      {/* Examples */}
                      <div className="bg-black rounded-sm p-4 border border-zinc-800">
                        <label className="text-sm font-semibold mb-4 block">
                          Language Specific Examples
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-control">
                            <span className="label-text text-xs mb-1 opacity-70">
                              Input
                            </span>
                            <textarea
                              className="textarea textarea-sm textarea-bordered w-full bg-black/40 font-mono text-xs"
                              {...register(`examples.${language}.input`)}
                              placeholder="Input..."
                            />
                          </div>
                          <div className="form-control">
                            <span className="label-text text-xs mb-1 opacity-70">
                              Output
                            </span>
                            <textarea
                              className="textarea textarea-sm textarea-bordered w-full bg-black/40 font-mono text-xs"
                              {...register(`examples.${language}.output`)}
                              placeholder="Output..."
                            />
                          </div>
                          <div className="form-control md:col-span-2">
                            <span className="label-text text-xs mb-1 opacity-70">
                              Explanation
                            </span>
                            <textarea
                              className="textarea textarea-sm textarea-bordered w-full bg-black/40 text-xs"
                              {...register(`examples.${language}.explanation`)}
                              placeholder="Explain logic..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra Info */}
              <div className="bg-black rounded-sm p-6 border border-zinc-800">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white mb-4">
                  <Lightbulb className="w-5 h-5 text-warning" />
                  Hints & Extras
                </h3>
                <div className="grid gap-4">
                  <div>
                    <label className="label pl-0">
                      <span className="label-text font-medium text-base-content/80">
                        Constraints
                      </span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered min-h-24 w-full bg-black border-zinc-800 rounded-sm focus:border-emerald-500/50 transition-all"
                      {...register("constraints")}
                      placeholder="e.g. 1 <= n <= 10^5"
                    />
                    {errors.constraints && (
                      <span className="text-error text-xs mt-1">
                        {errors.constraints.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="label pl-0">
                      <span className="label-text font-medium text-base-content/80">
                        Hints
                      </span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered min-h-20 w-full bg-black border-zinc-800 rounded-sm focus:border-emerald-500/50 transition-all"
                      {...register("hints")}
                      placeholder="Helpful tips..."
                    />
                  </div>
                  <div>
                    <label className="label pl-0">
                      <span className="label-text font-medium text-base-content/80">
                        Editorial
                      </span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered min-h-32 w-full bg-black border-zinc-800 rounded-sm focus:border-emerald-500/50 transition-all"
                      {...register("editorial")}
                      placeholder="Full solution explanation..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-white/5">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform w-full md:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin text-white" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Publish Problem
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Overlay Loading */}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-[#0d0d0d] border border-zinc-800 p-8 rounded-sm flex flex-col items-center gap-4">
            <Loader2 className="size-10 animate-spin text-zinc-400" />
            <p className="text-lg font-medium text-white">
              Creating Problem...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProblemForm;
