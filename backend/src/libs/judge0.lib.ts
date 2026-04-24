import axios from "axios";
import { withResilience } from "./resilience.util.js";

const JDOODLE_EXECUTE_URL = "https://api.jdoodle.com/v1/execute";

interface LanguageConfig {
  label: string;
  jdoodleLanguage: string;
  versionIndex: string;
}

export const CASE_OUTPUT_START = "__ALGOPREP_CASE_START__";
export const CASE_OUTPUT_END = "__ALGOPREP_CASE_END__";

const LANGUAGE_CONFIG_BY_ID: Record<number, LanguageConfig> = {
  54: { label: "C++", jdoodleLanguage: "cpp17", versionIndex: "0" },
  62: { label: "Java", jdoodleLanguage: "java", versionIndex: "5" },
  63: { label: "JavaScript", jdoodleLanguage: "nodejs", versionIndex: "6" },
  71: { label: "Python", jdoodleLanguage: "python3", versionIndex: "5" },
  74: { label: "TypeScript", jdoodleLanguage: "typescript", versionIndex: "0" },
};

const LANGUAGE_ID_BY_NAME: Record<string, number> = {
  CPP: 54,
  CPLUSPLUS: 54,
  CXX: 54,
  JAVA: 62,
  JAVASCRIPT: 63,
  JS: 63,
  PYTHON: 71,
  PYTHON3: 71,
  TYPESCRIPT: 74,
  TS: 74,
};

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
}

interface JDoodleResponse {
  output?: string;
  error?: string;
  memory?: string;
  cpuTime?: string;
  statusCode?: number;
  compilationStatus?: number;
}

export interface Judge0SubmissionResult {
  stdout: string | null;
  time: string;
  memory: number;
  stderr: string | null;
  token: string;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
}

export const buildBatchedStdin = (testcases: string[]) =>
  [
    String(testcases.length),
    ...testcases.flatMap((testcase) => {
      const normalized = testcase.replace(/\r\n/g, "\n");
      const lines = normalized.split("\n");
      return [String(lines.length), ...lines];
    }),
  ].join("\n");

export const parseBatchedStdout = (
  output: string | null | undefined
): string[] | null => {
  if (typeof output !== "string") {
    return null;
  }

  const pattern = new RegExp(
    `${CASE_OUTPUT_START}\\n([\\s\\S]*?)\\n${CASE_OUTPUT_END}`,
    "g"
  );
  const matches = [...output.matchAll(pattern)];

  if (matches.length === 0) {
    return null;
  }

  return matches.map((match) => match[1]?.replace(/\r\n/g, "\n") ?? "");
};

export const executeSubmission = async (
  submission: Judge0Submission
): Promise<Judge0SubmissionResult> => {
  const token = crypto.randomUUID();
  
  const jdoodleResponse = await withResilience(
    () => executeJDoodle(submission),
    {
      timeoutMs: 15000, // Slightly shorter than axios timeout for circuit breaking
      retries: 2,
      onRetry: (err, attempt) => {
        console.warn(`[RETRY] JDoodle execution attempt ${attempt} failed: ${err.message}`);
      }
    }
  );

  return mapJDoodleToJudge0(jdoodleResponse, token);
};

export const getJudge0LanguageId = (language: string) =>
  LANGUAGE_ID_BY_NAME[language.toUpperCase()];

const getLanguageConfig = (languageId: number): LanguageConfig => {
  const config = LANGUAGE_CONFIG_BY_ID[languageId];

  if (!config) {
    throw new Error(`Unsupported language id: ${languageId}`);
  }

  return config;
};

const ensureJDoodleCredentials = () => {
  if (!process.env.JDOODLE_CLIENT_ID || !process.env.JDOODLE_CLIENT_SECRET) {
    throw new Error(
      "JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET are not defined"
    );
  }
};

const toNullableString = (value?: string) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const parseMemory = (value?: string) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseCpuTime = (value?: string) => {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed.toString() : "0";
};

const inferStatus = (response: JDoodleResponse) => {
  const combinedMessage = `${response.error ?? ""}\n${response.output ?? ""}`
    .trim()
    .toLowerCase();

  if (response.compilationStatus && response.compilationStatus !== 0) {
    return { id: 6, description: "Compilation Error" };
  }

  if (
    response.statusCode &&
    response.statusCode !== 200 &&
    combinedMessage.includes("time limit")
  ) {
    return { id: 5, description: "Time Limit Exceeded" };
  }

  if (
    response.statusCode &&
    response.statusCode !== 200 &&
    combinedMessage.length > 0
  ) {
    return { id: 11, description: "Runtime Error" };
  }

  return { id: 3, description: "Accepted" };
};

const executeJDoodle = async (
  submission: Judge0Submission
): Promise<JDoodleResponse> => {
  ensureJDoodleCredentials();

  const languageConfig = getLanguageConfig(submission.language_id);

  const payload = {
    clientId: process.env.JDOODLE_CLIENT_ID,
    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    script: submission.source_code,
    stdin: submission.stdin || "",
    language: languageConfig.jdoodleLanguage,
    versionIndex: languageConfig.versionIndex,
    compileOnly: false,
  };

  const { data } = await axios.post<JDoodleResponse>(
    JDOODLE_EXECUTE_URL,
    payload,
    {
      timeout: 20000,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};

const mapJDoodleToJudge0 = (
  jdoodle: JDoodleResponse,
  token: string
): Judge0SubmissionResult => {
  const status = inferStatus(jdoodle);
  const compileOutput =
    status.description === "Compilation Error"
      ? toNullableString(jdoodle.error ?? jdoodle.output)
      : null;
  const runtimeError =
    status.description === "Runtime Error" ||
    status.description === "Time Limit Exceeded"
      ? toNullableString(jdoodle.error ?? jdoodle.output)
      : null;
  const stdout = status.id === 3 ? toNullableString(jdoodle.output) : null;

  return {
    stdout,
    time: parseCpuTime(jdoodle.cpuTime),
    memory: parseMemory(jdoodle.memory),
    stderr: runtimeError,
    token,
    compile_output: compileOutput,
    message: null,
    status,
  };
};

export function getLanguageName(languageId: number) {
  return getLanguageConfig(languageId).label;
}
