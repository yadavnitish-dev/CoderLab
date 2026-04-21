export enum SubmissionStatus {
  ACCEPTED = "Accepted",
  WRONG_ANSWER = "Wrong Answer",
  TIME_LIMIT_EXCEEDED = "Time Limit Exceeded",
  RUNTIME_ERROR = "Runtime Error",
  COMPILATION_ERROR = "Compilation Error",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  image?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  codeSnippets?: Record<string, string>;
  examples?: Record<string, {
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string;
  hints?: string;
  testcases?: Array<{
    input: string;
    output: string;
  }>;
  solvedBy?: Array<{
    userId: string;
    problemId: string;
    status: string;
    submittedAt: string;
  }>;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  userId: string;
  problems?: { problem: Problem }[];
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id?: string;
  userId?: string;
  problemId?: string;
  status: SubmissionStatus;
  language: string;
  timeTaken?: number;
  memoryTaken?: number;
  sourceCode: string;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  createdAt?: string;
  memory?: string | null;
  time?: string | null;
  testCases: Array<{
    id?: string;
    passed: boolean;
    expected: string;
    stdout: string | null;
    memory?: string | number | null;
    time?: string | number | null;
    stderr?: string | null;
    compileOutput?: string | null;
    status?: any;
  }>;
}
