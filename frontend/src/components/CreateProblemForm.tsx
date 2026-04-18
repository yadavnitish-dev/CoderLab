import { useForm, useFieldArray, Controller } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod"
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
  Terminal,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState, useEffect } from 'react';
import {axiosInstance} from "../lib/axios"
import toast from "react-hot-toast";
import {useNavigate, useParams} from "react-router-dom";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.object({ value: z.string() })).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
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
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});


const sampledpData = {
  title: "Climbing Stairs",
  category: "dp", // Dynamic Programming
  description:
    "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints:
    "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial:
    "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testcases: [
    {
      input: "2",
      output: "2",
    },
    {
      input: "3",
      output: "3",
    },
    {
      input: "4",
      output: "5",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
    PYTHON: {
      input: "n = 3",
      output: "3",
      explanation:
        "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
    JAVA: {
      input: "n = 4",
      output: "5",
      explanation:
        "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `const CASE_START = "__ALGOPREP_CASE_START__";
const CASE_END = "__ALGOPREP_CASE_END__";

/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Write your code here
}

function solveCase(rawInput) {
  const n = parseInt(rawInput.trim(), 10);
  return String(climbStairs(n));
}

function parseBatchedInput(raw) {
  const lines = raw.replace(/\\r\\n/g, "\\n").split("\\n");
  let index = 0;
  const totalCases = parseInt(lines[index++] || "0", 10);
  const cases = [];

  for (let i = 0; i < totalCases; i++) {
    const lineCount = parseInt(lines[index++] || "0", 10);
    cases.push(lines.slice(index, index + lineCount).join("\\n"));
    index += lineCount;
  }

  return cases;
}

const fs = require("fs");
const testcases = parseBatchedInput(fs.readFileSync(0, "utf8"));
const outputs = testcases.map((testcase) => solveCase(testcase));
process.stdout.write(
  outputs.map((output) => \`\${CASE_START}\\n\${output}\\n\${CASE_END}\`).join("\\n")
);`,
    PYTHON: `import sys

CASE_START = "__ALGOPREP_CASE_START__"
CASE_END = "__ALGOPREP_CASE_END__"


class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass


def solve_case(raw_input: str) -> str:
  n = int(raw_input.strip())
  sol = Solution()
  return str(sol.climbStairs(n))


def parse_batched_input(raw: str) -> list[str]:
  lines = raw.replace("\\r\\n", "\\n").split("\\n")
  index = 0
  total_cases = int(lines[index] or "0")
  index += 1
  cases = []

  for _ in range(total_cases):
    line_count = int(lines[index] or "0")
    index += 1
    cases.append("\\n".join(lines[index:index + line_count]))
    index += line_count

  return cases


if __name__ == "__main__":
  raw = sys.stdin.read()
  testcases = parse_batched_input(raw) if raw else []
  outputs = [solve_case(testcase) for testcase in testcases]
  sys.stdout.write("\\n".join(f"{CASE_START}\\n{output}\\n{CASE_END}" for output in outputs))`,
    JAVA: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

class Main {
  private static final String CASE_START = "__ALGOPREP_CASE_START__";
  private static final String CASE_END = "__ALGOPREP_CASE_END__";

  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }

  private String solveCase(String rawInput) {
      int n = Integer.parseInt(rawInput.trim());
      return String.valueOf(climbStairs(n));
  }

  private static List<String> parseBatchedInput(BufferedReader reader) throws Exception {
      List<String> cases = new ArrayList<>();
      String totalLine = reader.readLine();
      int totalCases = Integer.parseInt((totalLine == null ? "0" : totalLine).trim());

      for (int i = 0; i < totalCases; i++) {
          String countLine = reader.readLine();
          int lineCount = Integer.parseInt((countLine == null ? "0" : countLine).trim());
          StringBuilder currentCase = new StringBuilder();

          for (int line = 0; line < lineCount; line++) {
              String currentLine = reader.readLine();
              if (currentLine == null) {
                  currentLine = "";
              }
              currentCase.append(currentLine);
              if (line < lineCount - 1) {
                  currentCase.append("\\n");
              }
          }

          cases.add(currentCase.toString());
      }

      return cases;
  }
  
  public static void main(String[] args) throws Exception {
      BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
      List<String> testcases = parseBatchedInput(reader);
      Main main = new Main();
      StringBuilder output = new StringBuilder();

      for (int i = 0; i < testcases.size(); i++) {
          if (i > 0) {
              output.append("\\n");
          }
          output.append(CASE_START).append("\\n");
          output.append(main.solveCase(testcases.get(i))).append("\\n");
          output.append(CASE_END);
      }

      System.out.print(output);
  }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `const CASE_START = "__ALGOPREP_CASE_START__";
const CASE_END = "__ALGOPREP_CASE_END__";

/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  if (n <= 2) {
    return n;
  }

  let dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

function solveCase(rawInput) {
  const n = parseInt(rawInput.trim(), 10);
  return String(climbStairs(n));
}

function parseBatchedInput(raw) {
  const lines = raw.replace(/\\r\\n/g, "\\n").split("\\n");
  let index = 0;
  const totalCases = parseInt(lines[index++] || "0", 10);
  const cases = [];

  for (let i = 0; i < totalCases; i++) {
    const lineCount = parseInt(lines[index++] || "0", 10);
    cases.push(lines.slice(index, index + lineCount).join("\\n"));
    index += lineCount;
  }

  return cases;
}

const fs = require("fs");
const testcases = parseBatchedInput(fs.readFileSync(0, "utf8"));
const outputs = testcases.map((testcase) => solveCase(testcase));
process.stdout.write(
  outputs.map((output) => \`\${CASE_START}\\n\${output}\\n\${CASE_END}\`).join("\\n")
);`,
    PYTHON: `import sys

CASE_START = "__ALGOPREP_CASE_START__"
CASE_END = "__ALGOPREP_CASE_END__"


class Solution:
  def climbStairs(self, n: int) -> int:
      if n <= 2:
          return n

      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2

      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]

      return dp[n]


def solve_case(raw_input: str) -> str:
  n = int(raw_input.strip())
  sol = Solution()
  return str(sol.climbStairs(n))


def parse_batched_input(raw: str) -> list[str]:
  lines = raw.replace("\\r\\n", "\\n").split("\\n")
  index = 0
  total_cases = int(lines[index] or "0")
  index += 1
  cases = []

  for _ in range(total_cases):
    line_count = int(lines[index] or "0")
    index += 1
    cases.append("\\n".join(lines[index:index + line_count]))
    index += line_count

  return cases


if __name__ == "__main__":
  raw = sys.stdin.read()
  testcases = parse_batched_input(raw) if raw else []
  outputs = [solve_case(testcase) for testcase in testcases]
  sys.stdout.write("\\n".join(f"{CASE_START}\\n{output}\\n{CASE_END}" for output in outputs))`,
    JAVA: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

class Main {
  private static final String CASE_START = "__ALGOPREP_CASE_START__";
  private static final String CASE_END = "__ALGOPREP_CASE_END__";

  public int climbStairs(int n) {
      if (n <= 2) {
          return n;
      }

      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;

      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }

      return dp[n];
  }

  private String solveCase(String rawInput) {
      int n = Integer.parseInt(rawInput.trim());
      return String.valueOf(climbStairs(n));
  }

  private static List<String> parseBatchedInput(BufferedReader reader) throws Exception {
      List<String> cases = new ArrayList<>();
      String totalLine = reader.readLine();
      int totalCases = Integer.parseInt((totalLine == null ? "0" : totalLine).trim());

      for (int i = 0; i < totalCases; i++) {
          String countLine = reader.readLine();
          int lineCount = Integer.parseInt((countLine == null ? "0" : countLine).trim());
          StringBuilder currentCase = new StringBuilder();

          for (int line = 0; line < lineCount; line++) {
              String currentLine = reader.readLine();
              if (currentLine == null) {
                  currentLine = "";
              }
              currentCase.append(currentLine);
              if (line < lineCount - 1) {
                  currentCase.append("\\n");
              }
          }

          cases.add(currentCase.toString());
      }

      return cases;
  }
  
  public static void main(String[] args) throws Exception {
      BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
      List<String> testcases = parseBatchedInput(reader);
      Main main = new Main();
      StringBuilder output = new StringBuilder();

      for (int i = 0; i < testcases.size(); i++) {
          if (i > 0) {
              output.append("\\n");
          }
          output.append(CASE_START).append("\\n");
          output.append(main.solveCase(testcases.get(i))).append("\\n");
          output.append(CASE_END);
      }

      System.out.print(output);
  }
}`,
  },
};

// Sample problem data for another type of question
const sampleStringProblem = {
  title: "Valid Palindrome",
  description:
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  constraints:
    "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints:
    "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial:
    "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testcases: [
    {
      input: "A man, a plan, a canal: Panama",
      output: "true",
    },
    {
      input: "race a car",
      output: "false",
    },
    {
      input: " ",
      output: "true",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    PYTHON: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    JAVA: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
  },
  codeSnippets: {
    JAVASCRIPT: `const CASE_START = "__ALGOPREP_CASE_START__";
const CASE_END = "__ALGOPREP_CASE_END__";

/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // Write your code here
}

function solveCase(rawInput) {
  return isPalindrome(rawInput) ? "true" : "false";
}

function parseBatchedInput(raw) {
  const lines = raw.replace(/\\r\\n/g, "\\n").split("\\n");
  let index = 0;
  const totalCases = parseInt(lines[index++] || "0", 10);
  const cases = [];

  for (let i = 0; i < totalCases; i++) {
    const lineCount = parseInt(lines[index++] || "0", 10);
    cases.push(lines.slice(index, index + lineCount).join("\\n"));
    index += lineCount;
  }

  return cases;
}

const fs = require("fs");
const testcases = parseBatchedInput(fs.readFileSync(0, "utf8"));
const outputs = testcases.map((testcase) => solveCase(testcase));
process.stdout.write(
  outputs.map((output) => \`\${CASE_START}\\n\${output}\\n\${CASE_END}\`).join("\\n")
);`,
    PYTHON: `import sys

CASE_START = "__ALGOPREP_CASE_START__"
CASE_END = "__ALGOPREP_CASE_END__"


class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Write your code here
          pass


def solve_case(raw_input: str) -> str:
    sol = Solution()
    return str(sol.isPalindrome(raw_input)).lower()


def parse_batched_input(raw: str) -> list[str]:
    lines = raw.replace("\\r\\n", "\\n").split("\\n")
    index = 0
    total_cases = int(lines[index] or "0")
    index += 1
    cases = []

    for _ in range(total_cases):
        line_count = int(lines[index] or "0")
        index += 1
        cases.append("\\n".join(lines[index:index + line_count]))
        index += line_count

    return cases


if __name__ == "__main__":
    raw = sys.stdin.read()
    testcases = parse_batched_input(raw) if raw else []
    outputs = [solve_case(testcase) for testcase in testcases]
    sys.stdout.write("\\n".join(f"{CASE_START}\\n{output}\\n{CASE_END}" for output in outputs))`,
    JAVA: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class Main {
    private static final String CASE_START = "__ALGOPREP_CASE_START__";
    private static final String CASE_END = "__ALGOPREP_CASE_END__";

    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
       
    }

    private static List<String> parseBatchedInput(BufferedReader reader) throws Exception {
        List<String> cases = new ArrayList<>();
        String totalLine = reader.readLine();
        int totalCases = Integer.parseInt((totalLine == null ? "0" : totalLine).trim());

        for (int i = 0; i < totalCases; i++) {
            String countLine = reader.readLine();
            int lineCount = Integer.parseInt((countLine == null ? "0" : countLine).trim());
            StringBuilder currentCase = new StringBuilder();

            for (int line = 0; line < lineCount; line++) {
                String currentLine = reader.readLine();
                if (currentLine == null) {
                    currentLine = "";
                }
                currentCase.append(currentLine);
                if (line < lineCount - 1) {
                    currentCase.append("\\n");
                }
            }

            cases.add(currentCase.toString());
        }

        return cases;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        List<String> testcases = parseBatchedInput(reader);
        StringBuilder output = new StringBuilder();

        for (int i = 0; i < testcases.size(); i++) {
            if (i > 0) {
                output.append("\\n");
            }
            output.append(CASE_START).append("\\n");
            output.append(isPalindrome(testcases.get(i)) ? "true" : "false").append("\\n");
            output.append(CASE_END);
        }

        System.out.print(output);
    }
}
`,
  },
  referenceSolutions: {
    JAVASCRIPT: `const CASE_START = "__ALGOPREP_CASE_START__";
const CASE_END = "__ALGOPREP_CASE_END__";

/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, "");

  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

function solveCase(rawInput) {
  return isPalindrome(rawInput) ? "true" : "false";
}

function parseBatchedInput(raw) {
  const lines = raw.replace(/\\r\\n/g, "\\n").split("\\n");
  let index = 0;
  const totalCases = parseInt(lines[index++] || "0", 10);
  const cases = [];

  for (let i = 0; i < totalCases; i++) {
    const lineCount = parseInt(lines[index++] || "0", 10);
    cases.push(lines.slice(index, index + lineCount).join("\\n"));
    index += lineCount;
  }

  return cases;
}

const fs = require("fs");
const testcases = parseBatchedInput(fs.readFileSync(0, "utf8"));
const outputs = testcases.map((testcase) => solveCase(testcase));
process.stdout.write(
  outputs.map((output) => \`\${CASE_START}\\n\${output}\\n\${CASE_END}\`).join("\\n")
);`,
    PYTHON: `import sys

CASE_START = "__ALGOPREP_CASE_START__"
CASE_END = "__ALGOPREP_CASE_END__"


class Solution:
      def isPalindrome(self, s: str) -> bool:
          filtered_chars = [c.lower() for c in s if c.isalnum()]
          return filtered_chars == filtered_chars[::-1]


def solve_case(raw_input: str) -> str:
    sol = Solution()
    return str(sol.isPalindrome(raw_input)).lower()


def parse_batched_input(raw: str) -> list[str]:
    lines = raw.replace("\\r\\n", "\\n").split("\\n")
    index = 0
    total_cases = int(lines[index] or "0")
    index += 1
    cases = []

    for _ in range(total_cases):
        line_count = int(lines[index] or "0")
        index += 1
        cases.append("\\n".join(lines[index:index + line_count]))
        index += line_count

    return cases


if __name__ == "__main__":
    raw = sys.stdin.read()
    testcases = parse_batched_input(raw) if raw else []
    outputs = [solve_case(testcase) for testcase in testcases]
    sys.stdout.write("\\n".join(f"{CASE_START}\\n{output}\\n{CASE_END}" for output in outputs))`,
    JAVA: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class Main {
    private static final String CASE_START = "__ALGOPREP_CASE_START__";
    private static final String CASE_END = "__ALGOPREP_CASE_END__";

    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }

        return true;
    }

    private static List<String> parseBatchedInput(BufferedReader reader) throws Exception {
        List<String> cases = new ArrayList<>();
        String totalLine = reader.readLine();
        int totalCases = Integer.parseInt((totalLine == null ? "0" : totalLine).trim());

        for (int i = 0; i < totalCases; i++) {
            String countLine = reader.readLine();
            int lineCount = Integer.parseInt((countLine == null ? "0" : countLine).trim());
            StringBuilder currentCase = new StringBuilder();

            for (int line = 0; line < lineCount; line++) {
                String currentLine = reader.readLine();
                if (currentLine == null) {
                    currentLine = "";
                }
                currentCase.append(currentLine);
                if (line < lineCount - 1) {
                    currentCase.append("\\n");
                }
            }

            cases.add(currentCase.toString());
        }

        return cases;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        List<String> testcases = parseBatchedInput(reader);
        StringBuilder output = new StringBuilder();

        for (int i = 0; i < testcases.size(); i++) {
            if (i > 0) {
                output.append("\\n");
            }
            output.append(CASE_START).append("\\n");
            output.append(isPalindrome(testcases.get(i)) ? "true" : "false").append("\\n");
            output.append(CASE_END);
        }

        System.out.print(output);
    }
}
`,
  },
};

const sampleThreeSumProblem = {
  title: "3Sum",
  description:
    "Given an integer array nums, return all the unique triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.",
  difficulty: "MEDIUM",
  tags: ["Array", "Two Pointers", "Sorting"],
  constraints:
    "3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5",
  hints:
    "Sort the array first, then fix one number and use two pointers for the remaining two numbers.",
  editorial:
    "After sorting, iterate each index i and use two pointers on the suffix to find pairs that sum to -nums[i]. Skip duplicate values for i, left, and right so each triplet appears exactly once.",
  testcases: [
    {
      input: "-1 0 1 2 -1 -4",
      output: "[[-1,-1,2],[-1,0,1]]",
    },
    {
      input: "0 1 1",
      output: "[]",
    },
    {
      input: "0 0 0",
      output: "[[0,0,0]]",
    },
    {
      input: "-2 0 0 2 2",
      output: "[[-2,0,2]]",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: "nums = [-1, 0, 1, 2, -1, -4]",
      output: "[[-1,-1,2],[-1,0,1]]",
      explanation:
        "After sorting, the unique zero-sum triplets are [-1, -1, 2] and [-1, 0, 1].",
    },
    PYTHON: {
      input: "nums = [0, 1, 1]",
      output: "[]",
      explanation:
        "No three numbers add up to zero, so the answer is an empty list.",
    },
    JAVA: {
      input: "nums = [0, 0, 0]",
      output: "[[0,0,0]]",
      explanation:
        "The only valid triplet is [0, 0, 0], and duplicates are removed.",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `const CASE_START = "__ALGOPREP_CASE_START__";
const CASE_END = "__ALGOPREP_CASE_END__";

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  // Write your code here
}

function parseNums(rawInput) {
  const trimmed = rawInput.trim();
  return trimmed ? trimmed.split(/\\s+/).map(Number) : [];
}

function solveCase(rawInput) {
  return JSON.stringify(threeSum(parseNums(rawInput)));
}

function parseBatchedInput(raw) {
  const lines = raw.replace(/\\r\\n/g, "\\n").split("\\n");
  let index = 0;
  const totalCases = parseInt(lines[index++] || "0", 10);
  const cases = [];

  for (let i = 0; i < totalCases; i++) {
    const lineCount = parseInt(lines[index++] || "0", 10);
    cases.push(lines.slice(index, index + lineCount).join("\\n"));
    index += lineCount;
  }

  return cases;
}

const fs = require("fs");
const testcases = parseBatchedInput(fs.readFileSync(0, "utf8"));
const outputs = testcases.map((testcase) => solveCase(testcase));
process.stdout.write(
  outputs.map((output) => \`\${CASE_START}\\n\${output}\\n\${CASE_END}\`).join("\\n")
);`,
    PYTHON: `import json
import sys

CASE_START = "__ALGOPREP_CASE_START__"
CASE_END = "__ALGOPREP_CASE_END__"


class Solution:
  def threeSum(self, nums: list[int]) -> list[list[int]]:
      # Write your code here
      return []


def parse_nums(raw_input: str) -> list[int]:
  trimmed = raw_input.strip()
  return list(map(int, trimmed.split())) if trimmed else []


def solve_case(raw_input: str) -> str:
  sol = Solution()
  return json.dumps(sol.threeSum(parse_nums(raw_input)), separators=(",", ":"))


def parse_batched_input(raw: str) -> list[str]:
  lines = raw.replace("\\r\\n", "\\n").split("\\n")
  index = 0
  total_cases = int(lines[index] or "0")
  index += 1
  cases = []

  for _ in range(total_cases):
    line_count = int(lines[index] or "0")
    index += 1
    cases.append("\\n".join(lines[index:index + line_count]))
    index += line_count

  return cases


if __name__ == "__main__":
  raw = sys.stdin.read()
  testcases = parse_batched_input(raw) if raw else []
  outputs = [solve_case(testcase) for testcase in testcases]
  sys.stdout.write("\\n".join(f"{CASE_START}\\n{output}\\n{CASE_END}" for output in outputs))`,
    JAVA: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
  private static final String CASE_START = "__ALGOPREP_CASE_START__";
  private static final String CASE_END = "__ALGOPREP_CASE_END__";

  public List<List<Integer>> threeSum(int[] nums) {
      // Write your code here
      return new ArrayList<>();
  }

  private static int[] parseNums(String rawInput) {
      String trimmed = rawInput.trim();
      if (trimmed.isEmpty()) {
          return new int[0];
      }

      String[] parts = trimmed.split("\\\\s+");
      int[] nums = new int[parts.length];
      for (int i = 0; i < parts.length; i++) {
          nums[i] = Integer.parseInt(parts[i]);
      }
      return nums;
  }

  private static String formatTriplets(List<List<Integer>> triplets) {
      StringBuilder builder = new StringBuilder("[");
      for (int i = 0; i < triplets.size(); i++) {
          if (i > 0) {
              builder.append(",");
          }
          builder.append("[");
          List<Integer> triplet = triplets.get(i);
          for (int j = 0; j < triplet.size(); j++) {
              if (j > 0) {
                  builder.append(",");
              }
              builder.append(triplet.get(j));
          }
          builder.append("]");
      }
      builder.append("]");
      return builder.toString();
  }

  private static List<String> parseBatchedInput(BufferedReader reader) throws Exception {
      List<String> cases = new ArrayList<>();
      String totalLine = reader.readLine();
      int totalCases = Integer.parseInt((totalLine == null ? "0" : totalLine).trim());

      for (int i = 0; i < totalCases; i++) {
          String countLine = reader.readLine();
          int lineCount = Integer.parseInt((countLine == null ? "0" : countLine).trim());
          StringBuilder currentCase = new StringBuilder();

          for (int line = 0; line < lineCount; line++) {
              String currentLine = reader.readLine();
              if (currentLine == null) {
                  currentLine = "";
              }
              currentCase.append(currentLine);
              if (line < lineCount - 1) {
                  currentCase.append("\\n");
              }
          }

          cases.add(currentCase.toString());
      }

      return cases;
  }

  public static void main(String[] args) throws Exception {
      BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
      List<String> testcases = parseBatchedInput(reader);
      Main main = new Main();
      StringBuilder output = new StringBuilder();

      for (int i = 0; i < testcases.size(); i++) {
          if (i > 0) {
              output.append("\\n");
          }
          output.append(CASE_START).append("\\n");
          output.append(formatTriplets(main.threeSum(parseNums(testcases.get(i))))).append("\\n");
          output.append(CASE_END);
      }

      System.out.print(output);
  }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `const CASE_START = "__ALGOPREP_CASE_START__";
const CASE_END = "__ALGOPREP_CASE_END__";

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;

        while (left < right && nums[left] === nums[left - 1]) {
          left++;
        }
        while (left < right && nums[right] === nums[right + 1]) {
          right--;
        }
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

function parseNums(rawInput) {
  const trimmed = rawInput.trim();
  return trimmed ? trimmed.split(/\\s+/).map(Number) : [];
}

function solveCase(rawInput) {
  return JSON.stringify(threeSum(parseNums(rawInput)));
}

function parseBatchedInput(raw) {
  const lines = raw.replace(/\\r\\n/g, "\\n").split("\\n");
  let index = 0;
  const totalCases = parseInt(lines[index++] || "0", 10);
  const cases = [];

  for (let i = 0; i < totalCases; i++) {
    const lineCount = parseInt(lines[index++] || "0", 10);
    cases.push(lines.slice(index, index + lineCount).join("\\n"));
    index += lineCount;
  }

  return cases;
}

const fs = require("fs");
const testcases = parseBatchedInput(fs.readFileSync(0, "utf8"));
const outputs = testcases.map((testcase) => solveCase(testcase));
process.stdout.write(
  outputs.map((output) => \`\${CASE_START}\\n\${output}\\n\${CASE_END}\`).join("\\n")
);`,
    PYTHON: `import json
import sys

CASE_START = "__ALGOPREP_CASE_START__"
CASE_END = "__ALGOPREP_CASE_END__"


class Solution:
  def threeSum(self, nums: list[int]) -> list[list[int]]:
      nums.sort()
      result = []

      for i in range(len(nums) - 2):
          if i > 0 and nums[i] == nums[i - 1]:
              continue

          left, right = i + 1, len(nums) - 1
          while left < right:
              current_sum = nums[i] + nums[left] + nums[right]
              if current_sum == 0:
                  result.append([nums[i], nums[left], nums[right]])
                  left += 1
                  right -= 1

                  while left < right and nums[left] == nums[left - 1]:
                      left += 1
                  while left < right and nums[right] == nums[right + 1]:
                      right -= 1
              elif current_sum < 0:
                  left += 1
              else:
                  right -= 1

      return result


def parse_nums(raw_input: str) -> list[int]:
  trimmed = raw_input.strip()
  return list(map(int, trimmed.split())) if trimmed else []


def solve_case(raw_input: str) -> str:
  sol = Solution()
  return json.dumps(sol.threeSum(parse_nums(raw_input)), separators=(",", ":"))


def parse_batched_input(raw: str) -> list[str]:
  lines = raw.replace("\\r\\n", "\\n").split("\\n")
  index = 0
  total_cases = int(lines[index] or "0")
  index += 1
  cases = []

  for _ in range(total_cases):
    line_count = int(lines[index] or "0")
    index += 1
    cases.append("\\n".join(lines[index:index + line_count]))
    index += line_count

  return cases


if __name__ == "__main__":
  raw = sys.stdin.read()
  testcases = parse_batched_input(raw) if raw else []
  outputs = [solve_case(testcase) for testcase in testcases]
  sys.stdout.write("\\n".join(f"{CASE_START}\\n{output}\\n{CASE_END}" for output in outputs))`,
    JAVA: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
  private static final String CASE_START = "__ALGOPREP_CASE_START__";
  private static final String CASE_END = "__ALGOPREP_CASE_END__";

  public List<List<Integer>> threeSum(int[] nums) {
      Arrays.sort(nums);
      List<List<Integer>> result = new ArrayList<>();

      for (int i = 0; i < nums.length - 2; i++) {
          if (i > 0 && nums[i] == nums[i - 1]) {
              continue;
          }

          int left = i + 1;
          int right = nums.length - 1;

          while (left < right) {
              int sum = nums[i] + nums[left] + nums[right];

              if (sum == 0) {
                  result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                  left++;
                  right--;

                  while (left < right && nums[left] == nums[left - 1]) {
                      left++;
                  }
                  while (left < right && nums[right] == nums[right + 1]) {
                      right--;
                  }
              } else if (sum < 0) {
                  left++;
              } else {
                  right--;
              }
          }
      }

      return result;
  }

  private static int[] parseNums(String rawInput) {
      String trimmed = rawInput.trim();
      if (trimmed.isEmpty()) {
          return new int[0];
      }

      String[] parts = trimmed.split("\\\\s+");
      int[] nums = new int[parts.length];
      for (int i = 0; i < parts.length; i++) {
          nums[i] = Integer.parseInt(parts[i]);
      }
      return nums;
  }

  private static String formatTriplets(List<List<Integer>> triplets) {
      StringBuilder builder = new StringBuilder("[");
      for (int i = 0; i < triplets.size(); i++) {
          if (i > 0) {
              builder.append(",");
          }
          builder.append("[");
          List<Integer> triplet = triplets.get(i);
          for (int j = 0; j < triplet.size(); j++) {
              if (j > 0) {
                  builder.append(",");
              }
              builder.append(triplet.get(j));
          }
          builder.append("]");
      }
      builder.append("]");
      return builder.toString();
  }

  private static List<String> parseBatchedInput(BufferedReader reader) throws Exception {
      List<String> cases = new ArrayList<>();
      String totalLine = reader.readLine();
      int totalCases = Integer.parseInt((totalLine == null ? "0" : totalLine).trim());

      for (int i = 0; i < totalCases; i++) {
          String countLine = reader.readLine();
          int lineCount = Integer.parseInt((countLine == null ? "0" : countLine).trim());
          StringBuilder currentCase = new StringBuilder();

          for (int line = 0; line < lineCount; line++) {
              String currentLine = reader.readLine();
              if (currentLine == null) {
                  currentLine = "";
              }
              currentCase.append(currentLine);
              if (line < lineCount - 1) {
                  currentCase.append("\\n");
              }
          }

          cases.add(currentCase.toString());
      }

      return cases;
  }

  public static void main(String[] args) throws Exception {
      BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
      List<String> testcases = parseBatchedInput(reader);
      Main main = new Main();
      StringBuilder output = new StringBuilder();

      for (int i = 0; i < testcases.size(); i++) {
          if (i > 0) {
              output.append("\\n");
          }
          output.append(CASE_START).append("\\n");
          output.append(formatTriplets(main.threeSum(parseNums(testcases.get(i))))).append("\\n");
          output.append(CASE_END);
      }

      System.out.print(output);
  }
}`,
  },
};

const CreateProblemForm = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const [sampleType , setSampleType] = useState("DP")
    const navigation = useNavigate();
    
    type ProblemFormData = z.infer<typeof problemSchema>;

    const {register , control , handleSubmit , reset , formState:{errors}} = useForm<ProblemFormData>(
        {
            resolver:zodResolver(problemSchema),
            defaultValues:{
                 testcases: [{ input: "", output: "" }],
      tags: [{ value: "" }],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "const CASE_START = \"__ALGOPREP_CASE_START__\";\nconst CASE_END = \"__ALGOPREP_CASE_END__\";\n\nfunction solveCase(rawInput) {\n  // Parse one testcase from rawInput and return the output as a string\n  return \"\";\n}\n\nfunction parseBatchedInput(raw) {\n  const lines = raw.replace(/\\r\\n/g, \"\\n\").split(\"\\n\");\n  let index = 0;\n  const totalCases = parseInt(lines[index++] || \"0\", 10);\n  const cases = [];\n\n  for (let i = 0; i < totalCases; i++) {\n    const lineCount = parseInt(lines[index++] || \"0\", 10);\n    cases.push(lines.slice(index, index + lineCount).join(\"\\n\"));\n    index += lineCount;\n  }\n\n  return cases;\n}\n\nconst fs = require(\"fs\");\nconst testcases = parseBatchedInput(fs.readFileSync(0, \"utf8\"));\nconst outputs = testcases.map((testcase) => String(solveCase(testcase)));\nprocess.stdout.write(\n  outputs.map((output) => `${CASE_START}\\n${output}\\n${CASE_END}`).join(\"\\n\")\n);",
        PYTHON: "import sys\n\nCASE_START = \"__ALGOPREP_CASE_START__\"\nCASE_END = \"__ALGOPREP_CASE_END__\"\n\n\ndef solve_case(raw_input: str) -> str:\n    # Parse one testcase from raw_input and return the output as a string\n    return \"\"\n\n\ndef parse_batched_input(raw: str) -> list[str]:\n    lines = raw.replace(\"\\r\\n\", \"\\n\").split(\"\\n\")\n    index = 0\n    total_cases = int(lines[index] or \"0\")\n    index += 1\n    cases = []\n\n    for _ in range(total_cases):\n        line_count = int(lines[index] or \"0\")\n        index += 1\n        cases.append(\"\\n\".join(lines[index:index + line_count]))\n        index += line_count\n\n    return cases\n\n\nif __name__ == \"__main__\":\n    raw = sys.stdin.read()\n    testcases = parse_batched_input(raw) if raw else []\n    outputs = [str(solve_case(testcase)) for testcase in testcases]\n    sys.stdout.write(\"\\n\".join(f\"{CASE_START}\\n{output}\\n{CASE_END}\" for output in outputs))",
        JAVA: "import java.io.BufferedReader;\nimport java.io.InputStreamReader;\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    private static final String CASE_START = \"__ALGOPREP_CASE_START__\";\n    private static final String CASE_END = \"__ALGOPREP_CASE_END__\";\n\n    private static String solveCase(String rawInput) {\n        // Parse one testcase from rawInput and return the output as a string\n        return \"\";\n    }\n\n    private static List<String> parseBatchedInput(BufferedReader reader) throws Exception {\n        List<String> cases = new ArrayList<>();\n        String totalLine = reader.readLine();\n        int totalCases = Integer.parseInt((totalLine == null ? \"0\" : totalLine).trim());\n\n        for (int i = 0; i < totalCases; i++) {\n            String countLine = reader.readLine();\n            int lineCount = Integer.parseInt((countLine == null ? \"0\" : countLine).trim());\n            StringBuilder currentCase = new StringBuilder();\n\n            for (int line = 0; line < lineCount; line++) {\n                String currentLine = reader.readLine();\n                if (currentLine == null) {\n                    currentLine = \"\";\n                }\n                currentCase.append(currentLine);\n                if (line < lineCount - 1) {\n                    currentCase.append(\"\\n\");\n                }\n            }\n\n            cases.add(currentCase.toString());\n        }\n\n        return cases;\n    }\n\n    public static void main(String[] args) throws Exception {\n        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));\n        List<String> testcases = parseBatchedInput(reader);\n        StringBuilder output = new StringBuilder();\n\n        for (int i = 0; i < testcases.size(); i++) {\n            if (i > 0) {\n                output.append(\"\\n\");\n            }\n            output.append(CASE_START).append(\"\\n\");\n            output.append(solveCase(testcases.get(i))).append(\"\\n\");\n            output.append(CASE_END);\n        }\n\n        System.out.print(output);\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
            }
        }
    )

    useEffect(() => {
        if (isEditing) {
            const fetchProblem = async () => {
                try {
                    const res = await axiosInstance.get(`/problems/get-problem/${id}`);
                    const problemData = res.data.problem;
                    // Transform tags from string[] to {value: string}[]
                    const formattedTags = problemData.tags.map((tag: string) => ({ value: tag }));
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

  const [isLoading , setIsLoading] = useState(false);

  const onSubmit = async (value: ProblemFormData)=>{
   try {
    setIsLoading(true)
    // Transform tags from {value: string}[] to string[] for API
    const formattedData = {
        ...value,
        tags: value.tags.map(tag => tag.value) // Extract strings from objects
    };

    if(isEditing){
        const res = await axiosInstance.put(`/problems/update-problem/${id}` , formattedData)
        toast.success(res.data.message || "Problem Updated successfully⚡");
    }else{
        const res = await axiosInstance.post("/problems/create-problem" , formattedData)
        toast.success(res.data.message || "Problem Created successfully⚡");
    }
    
    navigation("/explore");

   } catch (error) {
    console.log(error);
    toast.error(isEditing ? "Error updating problem" : "Error creating problem")
   }
   finally{
      setIsLoading(false);
   }
  }

  const loadSampleData=()=>{
    const sampleDataMap = {
      DP: sampledpData,
      string: sampleStringProblem,
      threeSum: sampleThreeSumProblem,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sampleData = sampleDataMap[sampleType as keyof typeof sampleDataMap] as any;
  
    const formattedTags = sampleData.tags.map((tag: string) => ({ value: tag }));
    replaceTags(formattedTags);
    replacetestcases(sampleData.testcases);

   // Reset the form with sample data
    reset({ ...sampleData, tags: formattedTags });
}

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-secondary/20 blur-[100px] rounded-full -z-10 opacity-30 pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="glass-panel rounded-2xl border border-white/5 shadow-2xl p-6 md:p-8 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-white/5 gap-4">
            <div>
              <h2 className="text-3xl font-bold font-display tracking-tight text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                {isEditing ? "Edit Problem" : "Create New Problem"}
              </h2>
              <p className="text-base-content/60 mt-1 ml-1">Contribute challenges to the community</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="join bg-black/20 border border-white/5 rounded-lg p-1">
                <button
                  type="button"
                  className={`btn btn-sm border-0 ${
                    sampleType === "DP" 
                    ? "bg-primary text-white shadow-lg" 
                    : "btn-ghost hover:bg-white/5"
                  }`}
                  onClick={() => setSampleType("DP")}
                >
                  DP
                </button>
                <button
                  type="button"
                  className={`btn btn-sm border-0 ${
                    sampleType === "string" 
                    ? "bg-primary text-white shadow-lg" 
                    : "btn-ghost hover:bg-white/5"
                  }`}
                  onClick={() => setSampleType("string")}
                >
                  String
                </button>
                <button
                  type="button"
                  className={`btn btn-sm border-0 ${
                    sampleType === "threeSum" 
                    ? "bg-primary text-white shadow-lg" 
                    : "btn-ghost hover:bg-white/5"
                  }`}
                  onClick={() => setSampleType("threeSum")}
                >
                  3Sum
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-ghost border border-white/10 hover:bg-white/5 gap-2"
                onClick={loadSampleData}
              >
                <Download className="w-4 h-4" />
                Load Sample
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control md:col-span-2">
                <label className="label pl-0">
                  <span className="label-text font-medium text-base-content/80">Problem Title</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full bg-black/20 border-white/10 focus:border-primary/50 focus:bg-black/40 transition-all ${errors.title ? 'input-error' : ''}`}
                  {...register("title")}
                  placeholder="e.g. Two Sum"
                />
                {errors.title && <span className="text-error text-xs mt-1">{errors.title.message}</span>}
              </div>

              <div className="form-control md:col-span-2">
                <label className="label pl-0">
                  <span className="label-text font-medium text-base-content/80">Description</span>
                </label>
                <textarea
                  className={`textarea textarea-bordered min-h-32 w-full bg-black/20 border-white/10 focus:border-primary/50 focus:bg-black/40 transition-all text-base leading-relaxed ${errors.description ? 'textarea-error' : ''}`}
                  {...register("description")}
                  placeholder="Describe the problem in detail..."
                />
                {errors.description && <span className="text-error text-xs mt-1">{errors.description.message}</span>}
              </div>

              <div className="form-control">
                <label className="label pl-0">
                  <span className="label-text font-medium text-base-content/80">Difficulty</span>
                </label>
                <select
                  className={`select select-bordered w-full bg-black/20 border-white/10 focus:border-primary/50 transition-all ${errors.difficulty ? 'select-error' : ''}`}
                  {...register("difficulty")}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
                {errors.difficulty && <span className="text-error text-xs mt-1">{errors.difficulty.message}</span>}
              </div>
            </div>

            {/* Tags Section */}
            <div className="bg-black/20 rounded-xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  Tags
                </h3>
                <button
                  type="button"
                  className="btn btn-xs btn-outline btn-secondary"
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
                      className="input input-sm input-bordered flex-1 bg-black/40 border-white/10 focus:border-secondary/50"
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
              {errors.tags && <div className="mt-2 text-error text-sm">{errors.tags.message}</div>}
            </div>

            {/* Test Cases Section */}
            <div className="bg-black/20 rounded-xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Test Cases
                </h3>
                <button
                  type="button"
                  className="btn btn-xs btn-outline btn-success"
                  onClick={() => appendTestCase({ input: "", output: "" })}
                >
                  <Plus className="w-3 h-3" /> Add Case
                </button>
              </div>
              
              <div className="space-y-4">
                {testCaseFields.map((field, index) => (
                  <div key={field.id} className="bg-black/40 rounded-lg p-4 border border-white/5 relative group">
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs btn-square absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/20 hover:text-error"
                      onClick={() => removeTestCase(index)}
                      disabled={testCaseFields.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <h4 className="text-xs font-mono text-base-content/50 mb-3 uppercase tracking-wider">Case #{index + 1}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label pt-0"><span className="label-text text-xs font-mono opacity-70">Input</span></label>
                        <textarea
                          className="textarea textarea-bordered min-h-16 w-full bg-black/60 border-white/5 font-mono text-sm leading-relaxed focus:border-success/50"
                          {...register(`testcases.${index}.input`)}
                          placeholder="Input data..."
                        />
                         {errors.testcases?.[index]?.input && <span className="text-error text-xs mt-1">{errors.testcases[index].input.message}</span>}
                      </div>
                      <div className="form-control">
                        <label className="label pt-0"><span className="label-text text-xs font-mono opacity-70">Expected Output</span></label>
                         <textarea
                          className="textarea textarea-bordered min-h-16 w-full bg-black/60 border-white/5 font-mono text-sm leading-relaxed focus:border-success/50"
                          {...register(`testcases.${index}.output`)}
                          placeholder="Expected output..."
                        />
                         {errors.testcases?.[index]?.output && <span className="text-error text-xs mt-1">{errors.testcases[index].output.message}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
               {errors.testcases && !Array.isArray(errors.testcases) && (
                 <div className="mt-2 text-error text-sm">{errors.testcases.message}</div>
               )}
            </div>

            {/* Language Specific Sections */}
            <div className="space-y-6">
              {(["JAVASCRIPT", "PYTHON", "JAVA"] as const).map((language) => (
                <div key={language} className="collapse collapse-arrow bg-black/20 border border-white/5 rounded-xl overflow-hidden">
                  <input type="checkbox" defaultChecked={language === "JAVASCRIPT"} /> 
                  <div className="collapse-title text-base font-semibold flex items-center gap-2 p-4">
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-base-300 border border-white/5`}>
                        <Code2 className="w-4 h-4" />
                     </div>
                     {language} Configuration
                  </div>
                  <div className="collapse-content p-6 border-t border-white/5 space-y-6">
                    
                    {/* Starter Code */}
                     <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-base-content/80">
                           <Terminal className="w-4 h-4" /> Starter Code
                        </h4>
                        <div className="border border-white/10 rounded-lg overflow-hidden">
                          <Controller
                            name={`codeSnippets.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="200px"
                                language={language.toLowerCase()}
                                theme="vs-dark"
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
                        {errors.codeSnippets?.[language] && <div className="text-error text-xs mt-1">{errors.codeSnippets[language].message}</div>}
                     </div>

                    {/* Reference Solution */}
                     <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-base-content/80">
                           <CheckCircle2 className="w-4 h-4 text-success" /> Valid Solution
                        </h4>
                        <div className="border border-white/10 rounded-lg overflow-hidden">
                          <Controller
                            name={`referenceSolutions.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="200px"
                                language={language.toLowerCase()}
                                theme="vs-dark"
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
                         {errors.referenceSolutions?.[language] && <div className="text-error text-xs mt-1">{errors.referenceSolutions[language].message}</div>}
                     </div>

                     {/* Examples */}
                     <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                        <label className="text-sm font-semibold mb-4 block">Language Specific Examples</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="form-control">
                              <span className="label-text text-xs mb-1 opacity-70">Input</span>
                              <textarea
                                className="textarea textarea-sm textarea-bordered w-full bg-black/40 font-mono text-xs"
                                {...register(`examples.${language}.input`)}
                                placeholder="Input..."
                              />
                           </div>
                           <div className="form-control">
                              <span className="label-text text-xs mb-1 opacity-70">Output</span>
                              <textarea
                                className="textarea textarea-sm textarea-bordered w-full bg-black/40 font-mono text-xs"
                                {...register(`examples.${language}.output`)}
                                placeholder="Output..."
                              />
                           </div>
                           <div className="form-control md:col-span-2">
                              <span className="label-text text-xs mb-1 opacity-70">Explanation</span>
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
             <div className="bg-black/20 rounded-xl p-6 border border-white/5">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white mb-4">
                  <Lightbulb className="w-5 h-5 text-warning" />
                  Hints & Extras
                </h3>
                <div className="grid gap-4">
                  <div>
                    <label className="label pl-0"><span className="label-text font-medium text-base-content/80">Constraints</span></label>
                     <textarea
                      className="textarea textarea-bordered min-h-24 w-full bg-black/40 border-white/10"
                      {...register("constraints")}
                      placeholder="e.g. 1 <= n <= 10^5"
                    />
                    {errors.constraints && <span className="text-error text-xs mt-1">{errors.constraints.message}</span>}
                  </div>
                   <div>
                    <label className="label pl-0"><span className="label-text font-medium text-base-content/80">Hints</span></label>
                     <textarea
                      className="textarea textarea-bordered min-h-20 w-full bg-black/40 border-white/10"
                      {...register("hints")}
                      placeholder="Helpful tips..."
                    />
                  </div>
                   <div>
                    <label className="label pl-0"><span className="label-text font-medium text-base-content/80">Editorial</span></label>
                     <textarea
                      className="textarea textarea-bordered min-h-32 w-full bg-black/40 border-white/10"
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
                  <span className="loading loading-spinner text-white"></span>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-lg font-medium text-white">Creating Problem...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateProblemForm
