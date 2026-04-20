import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

const n = "\\n";

const JAVASCRIPT_WRAPPER = (solution: string) => `
const CASE_START = "__ALGOPREP_CASE_START__";
const CASE_END = "__ALGOPREP_CASE_END__";

${solution}

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
  outputs.map((output) => CASE_START + "${n}" + output + "${n}" + CASE_END).join("${n}")
);
`;

const PYTHON_WRAPPER = (solution: string) => `
import sys

CASE_START = "__ALGOPREP_CASE_START__"
CASE_END = "__ALGOPREP_CASE_END__"

${solution}

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
    outputs = [str(solve_case(testcase)) for testcase in testcases]
    sys.stdout.write("\\n".join(f"{CASE_START}\\n{output}\\n{CASE_END}" for output in outputs))
`;

const JAVA_WRAPPER = (solution: string) => `
import java.util.*;
import java.io.*;

public class Main {
    static final String CASE_START = "__ALGOPREP_CASE_START__";
    static final String CASE_END = "__ALGOPREP_CASE_END__";

    ${solution}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int T = sc.nextInt();
        sc.nextLine(); 
        for (int i = 0; i < T; i++) {
            if (!sc.hasNextInt()) break;
            int L = sc.nextInt();
            sc.nextLine();
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < L; j++) {
                sb.append(sc.nextLine());
                if (j < L - 1) sb.append("\\n");
            }
            String result = solveCase(sb.toString());
            System.out.println(CASE_START + "\\n" + result + "\\n" + CASE_END);
        }
    }
}
`;

const CPP_WRAPPER = (solution: string) => `
#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <algorithm>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>

using namespace std;

const string CASE_START = "__ALGOPREP_CASE_START__";
const string CASE_END = "__ALGOPREP_CASE_END__";

${solution}

int main() {
    int T;
    if (!(cin >> T)) return 0;
    string dummy; getline(cin, dummy);
    for (int i = 0; i < T; i++) {
        int L; if (!(cin >> L)) break;
        getline(cin, dummy);
        string rawInput = "";
        for (int j = 0; j < L; j++) {
            string line; getline(cin, line);
            rawInput += line;
            if (j < L - 1) rawInput += "\\n";
        }
        string result = solveCase(rawInput);
        cout << CASE_START << endl << result << endl << CASE_END << endl;
    }
    return 0;
}
`;

const problems = [
  {
    title: "Contains Duplicate",
    description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    difficulty: "EASY",
    tags: ["Arrays & Hashing"],
    constraints: "- 1 <= nums.length <= 10^5\n- -10^9 <= nums[i] <= 10^9",
    examples: [
        { input: "nums = [1,2,3,1]", output: "true" },
        { input: "nums = [1,2,3,4]", output: "false" }
    ],
    actualTestCases: [
        { input: "4\n1\n2\n3\n1", output: "true" },
        { input: "4\n1\n2\n3\n4", output: "false" },
        { input: "10\n1\n1\n1\n3\n3\n4\n3\n2\n4\n2", output: "true" },
        { input: "1\n1", output: "false" }
    ],
    jsSolution: `
function containsDuplicate(nums) {
  return new Set(nums).size !== nums.length;
}

function solveCase(rawInput) {
  const lines = rawInput.trim().split("\\n");
  if (lines[0] === "0") return "false";
  const nums = lines.slice(1).map(Number);
  return containsDuplicate(nums).toString();
}
    `,
    pySolution: `
def containsDuplicate(nums): return len(nums) != len(set(nums))
def solve_case(raw_input):
    lines = raw_input.strip().split("\\n")
    if lines[0] == "0": return "false"
    nums = list(map(int, lines[1:]))
    return "true" if containsDuplicate(nums) else "false"
    `,
    javaSolution: `
public static String solveCase(String input) {
    String[] parts = input.split("\\\\s+");
    int n = Integer.parseInt(parts[0]);
    if (n == 0) return "false";
    Set<Integer> set = new HashSet<>();
    for (int i = 1; i <= n; i++) {
        int val = Integer.parseInt(parts[i]);
        if (set.contains(val)) return "true";
        set.add(val);
    }
    return "false";
}
    `,
    cppSolution: `
string solveCase(string input) {
    stringstream ss(input); int n; ss >> n;
    if (n == 0) return "false";
    unordered_set<int> memo;
    for(int i=0; i<n; i++) {
        int val; ss >> val;
        if (memo.count(val)) return "true";
        memo.insert(val);
    }
    return "false";
}
    `
  },
  {
    title: "Valid Anagram",
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
    difficulty: "EASY",
    tags: ["Arrays & Hashing"],
    constraints: "- 1 <= s.length, t.length <= 5 * 10^4",
    examples: [
        { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
        { input: "s = \"rat\", t = \"car\"", output: "false" }
    ],
    actualTestCases: [
        { input: "2\nanagram\nnagaram", output: "true" },
        { input: "2\nrat\ncar", output: "false" }
    ],
    jsSolution: `
function isAnagram(s, t) { if (s.length !== t.length) return false; return s.split('').sort().join('') === t.split('').sort().join(''); }
function solveCase(rawInput) { const lines = rawInput.split("\\n"); return isAnagram(lines[1] || "", lines[2] || "").toString(); }
    `,
    pySolution: `
def solve_case(raw): 
    lines = raw.strip().split("\\n")
    s, t = lines[1], lines[2]
    return "true" if sorted(s) == sorted(t) else "false"
    `,
    javaSolution: `
public static String solveCase(String in) {
    String[] lines = in.split("\\\\n");
    if(lines.length < 3) return "false";
    char[] s = lines[1].toCharArray(), t = lines[2].toCharArray();
    Arrays.sort(s); Arrays.sort(t);
    return Arrays.equals(s, t) ? "true" : "false";
}
    `,
    cppSolution: `
string solveCase(string in) {
    stringstream ss(in); string dummy, s, t;
    ss >> dummy >> s >> t;
    sort(s.begin(), s.end()); sort(t.begin(), t.end());
    return s == t ? "true" : "false";
}
    `
  },
  {
    title: "Two Sum",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    difficulty: "EASY",
    tags: ["Arrays & Hashing"],
    constraints: "- 2 <= nums.length <= 10^4",
    examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }
    ],
    actualTestCases: [
        { input: "5\n2 7 11 15\n9", output: "[0,1]" },
        { input: "4\n3 2 4\n6", output: "[1,2]" }
    ],
    jsSolution: `
function solveCase(raw) {
    const lines = raw.trim().split("\\n");
    const nums = lines[1].split(" ").map(Number);
    const target = Number(lines[2]);
    const map = new Map();
    for(let i=0; i<nums.length; i++) {
        let diff = target - nums[i];
        if(map.has(diff)) return \`[\${map.get(diff)},\${i}]\`;
        map.set(nums[i], i);
    }
    return "";
}
    `,
    pySolution: `
import json
def solve_case(raw):
    lines = raw.strip().split("\\n")
    nums = list(map(int, lines[1].split()))
    target = int(lines[2])
    d = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in d: return json.dumps([d[diff], i])
        d[n] = i
    return ""
    `,
    javaSolution: `
public static String solveCase(String in) {
    Scanner sc = new Scanner(in);
    if(!sc.hasNextInt()) return "";
    int n = sc.nextInt(); int[] nums = new int[n];
    for(int i=0; i<n; i++) nums[i] = sc.nextInt();
    int target = sc.nextInt();
    Map<Integer, Integer> map = new HashMap<>();
    for(int i=0; i<n; i++) {
        int diff = target - nums[i];
        if(map.containsKey(diff)) return "[" + map.get(diff) + "," + i + "]";
        map.put(nums[i], i);
    }
    return "";
}
    `,
    cppSolution: `
string solveCase(string in) {
    stringstream ss(in); int n; ss >> n;
    vector<int> nums(n); for(int i=0; i<n; i++) ss >> nums[i];
    int target; ss >> target;
    unordered_map<int, int> m;
    for(int i=0; i<n; i++) {
        int diff = target - nums[i];
        if(m.count(diff)) return "[" + to_string(m[diff]) + "," + to_string(i) + "]";
        m[nums[i]] = i;
    }
    return "";
}
    `
  },
  {
    title: "Group Anagrams",
    description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    difficulty: "MEDIUM",
    tags: ["Arrays & Hashing"],
    constraints: "- 1 <= strs.length <= 10^4",
    examples: [
        { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" }
    ],
    actualTestCases: [
        { input: "7\neat tea tan ate nat bat", output: "[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]" }
    ],
    jsSolution: `
function groupAnagrams(strs) {
    const map = {};
    for (let s of strs) {
        const key = s.split('').sort().join('');
        if (!map[key]) map[key] = [];
        map[key].push(s);
    }
    return Object.values(map);
}
function solveCase(raw) {
    const strs = raw.trim().split("\\n")[1].split(" ");
    return JSON.stringify(groupAnagrams(strs));
}
    `,
    pySolution: `
import json
def solve_case(raw):
    lines = raw.strip().split("\\n")
    if len(lines) < 2: return "[]"
    strs = lines[1].split()
    d = {}
    for s in strs:
        k = "".join(sorted(s))
        d[k] = d.get(k, []) + [s]
    return json.dumps(list(d.values()))
    `,
    javaSolution: `
public static String solveCase(String in) {
    String[] lines = in.split("\\\\n");
    if(lines.length < 2) return "[]";
    String[] strs = lines[1].split(" ");
    Map<String, List<String>> map = new TreeMap<>();
    for(String s : strs) {
        char[] chars = s.toCharArray(); Arrays.sort(chars);
        String key = new String(chars);
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    List<List<String>> res = new ArrayList<>(map.values());
    for(List<String> list : res) Collections.sort(list);
    return res.toString().replace(", ", ",");
}
    `,
    cppSolution: `
string solveCase(string in) {
    stringstream ss(in); int n; ss >> n;
    map<string, vector<string>> m; 
    for(int i=0; i<n; i++) {
        string s; ss >> s; string k = s; sort(k.begin(), k.end());
        m[k].push_back(s);
    }
    string res = "[";
    int j = 0;
    for(auto& [k, v] : m) {
        sort(v.begin(), v.end());
        res += "[";
        for(int i=0; i<v.size(); i++) res += "\\"" + v[i] + "\\"" + (i < v.size()-1 ? "," : "");
        res += "]" + (++j < m.size() ? "," : "");
    }
    return res + "]";
}
    `
  },
  {
    title: "Top K Frequent Elements",
    description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
    difficulty: "MEDIUM",
    tags: ["Arrays & Hashing"],
    constraints: "- 1 <= nums.length <= 10^5",
    examples: [
        { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" }
    ],
    actualTestCases: [
        { input: "8\n1 1 1 2 2 3\n2", output: "[1,2]" }
    ],
    jsSolution: `
function solveCase(raw) {
    const lines = raw.trim().split("\\n");
    const nums = lines[1].split(" ").map(Number);
    const k = parseInt(lines[2]);
    const map = {}; for(let n of nums) map[n] = (map[n]||0) + 1;
    const res = Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,k).map(x=>Number(x[0]));
    return JSON.stringify(res.sort());
}
    `,
    pySolution: `
import json, collections
def solve_case(raw):
    lines = raw.strip().split("\\n")
    nums = list(map(int, lines[1].split()))
    k = int(lines[2])
    res = [x[0] for x in collections.Counter(nums).most_common(k)]
    return json.dumps(sorted(res))
    `,
    javaSolution: `
public static String solveCase(String in) {
    Scanner sc = new Scanner(in); int n = sc.nextInt();
    Map<Integer, Integer> map = new HashMap<>();
    for(int i=0; i<n; i++) { int v = sc.nextInt(); map.put(v, map.getOrDefault(v, 0)+1); }
    int k = sc.nextInt();
    List<Integer> list = new ArrayList<>(map.keySet());
    list.sort((a, b) -> map.get(b) - map.get(a));
    List<Integer> res = new ArrayList<>(list.subList(0, k)); Collections.sort(res);
    return res.toString().replace(", ", ",");
}
    `,
    cppSolution: `
string solveCase(string in) {
    stringstream ss(in); int n; ss >> n;
    unordered_map<int, int> m; for(int i=0; i<n; i++) { int v; ss >> v; m[v]++; }
    int k; ss >> k;
    priority_queue<pair<int, int>> pq;
    for(auto const& [val, freq] : m) pq.push({freq, val});
    vector<int> res; for(int i=0; i<k; i++) { res.push_back(pq.top().second); pq.pop(); }
    sort(res.begin(), res.end());
    string s = "["; for(int i=0; i<res.size(); i++) s += to_string(res[i]) + (i<res.size()-1 ? "," : "");
    return s + "]";
}
    `
  }
];

async function main() {
  console.log('Seeding NeetCode 150 (First 5) with Multi-Language Support (JS, Python, Java, C++)...');

  const user = await prisma.user.findFirst({ where: { role: 'ADMIN' } }) || await prisma.user.findFirst();
  if (!user) { console.error('No admin found.'); return; }

  for (let i = 0; i < problems.length; i++) {
    const p = problems[i];
    const ncId = `NC_${i + 1}`;
    await prisma.problem.upsert({
      where: { id: ncId },
      update: {},
      create: {
        title: p.title,
        description: p.description,
        difficulty: p.difficulty as any,
        tags: p.tags,
        constraints: p.constraints,
        userId: user.id,
        testcases: p.actualTestCases as any,
        codeSnippets: {
          JAVASCRIPT: JAVASCRIPT_WRAPPER('function solveCase(raw) { return ""; }'),
          PYTHON: PYTHON_WRAPPER('def solve_case(raw): return ""'),
          JAVA: JAVA_WRAPPER('public static String solveCase(String in) { return ""; }'),
          CPP: CPP_WRAPPER('string solveCase(string in) { return ""; }')
        },
        referenceSolutions: {
          JAVASCRIPT: JAVASCRIPT_WRAPPER(p.jsSolution),
          PYTHON: PYTHON_WRAPPER(p.pySolution),
          JAVA: JAVA_WRAPPER(p.javaSolution),
          CPP: CPP_WRAPPER(p.cppSolution)
        },
        examples: (p as any).examples || []
      }
    });
    console.log(`Seeded (Multi-Lang): ${p.title}`);
  }
  console.log('Seeding complete.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
