export const NC_SKELETONS = {
  JAVA: `public static String solveCase(String rawInput) {
    // Write your code here
    return "";
}`,
  CPP: `string solveCase(string rawInput) {
    // Write your code here
    return "";
}`
};

export const NC150_SAMPLES: Record<string, any> = {
  NC_1: {
    title: "Contains Duplicate",
    description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    difficulty: "EASY",
    tags: ["Arrays & Hashing"],
    constraints: "- 1 <= nums.length <= 10^5\n- -10^9 <= nums[i] <= 10^9",
    hints: "Use a hash set to keep track of seen elements. If you encounter an element already in the set, a duplicate exists.",
    testcases: [
      { input: "4\n1\n2\n3\n1", output: "true" },
      { input: "4\n1\n2\n3\n4", output: "false" },
      { input: "10\n1\n1\n1\n3\n3\n4\n3\n2\n4\n2", output: "true" },
      { input: "1\n1", output: "false" },
      { input: "0", output: "false" },
      { input: "3\n-1\n-1\n0", output: "true" }
    ],
    examples: {
      JAVASCRIPT: { input: "nums = [1,2,3,1]", output: "true" },
      PYTHON: { input: "nums = [1,2,3,1]", output: "true" },
      JAVA: { input: "nums = [1,2,3,1]", output: "true" },
      CPP: { input: "nums = [1,2,3,1]", output: "true" }
    },
    codeSnippets: {
      JAVASCRIPT: "// Starter code\nfunction solveCase(rawInput) {\n  return \"\";\n}",
      PYTHON: "# Starter code\ndef solve_case(raw_input):\n    return \"\"",
      JAVA: NC_SKELETONS.JAVA,
      CPP: NC_SKELETONS.CPP
    },
    referenceSolutions: {
      JAVASCRIPT: "function containsDuplicate(nums) {\n  return new Set(nums).size !== nums.length;\n}\nfunction solveCase(rawInput) {\n  const lines = rawInput.trim().split(\"\\n\");\n  if (lines[0] === \"0\") return \"false\";\n  const nums = lines.slice(1).map(Number);\n  return containsDuplicate(nums).toString();\n}",
      PYTHON: "def containsDuplicate(nums): return len(nums) != len(set(nums))\ndef solve_case(raw_input): \n    lines = raw_input.strip().split(\"\\n\")\n    if lines[0] == \"0\": return \"false\"\n    nums = list(map(int, lines[1:]))\n    return \"true\" if containsDuplicate(nums) else \"false\"",
      JAVA: "import java.util.*;\npublic static String solveCase(String input) {\n    String[] parts = input.split(\"\\\\s+\");\n    int n = Integer.parseInt(parts[0]);\n    if (n == 0) return \"false\";\n    Set<Integer> set = new HashSet<>();\n    for (int i = 1; i <= n; i++) {\n        int val = Integer.parseInt(parts[i]);\n        if (set.contains(val)) return \"true\";\n        set.add(val);\n    }\n    return \"false\";\n}",
      CPP: "#include <unordered_set>\n#include <sstream>\nstring solveCase(string input) {\n    stringstream ss(input);\n    int n; ss >> n;\n    if (n == 0) return \"false\";\n    unordered_set<int> memo;\n    for(int i=0; i<n; i++) {\n        int val; ss >> val;\n        if (memo.count(val)) return \"true\";\n        memo.insert(val);\n    }\n    return \"false\";\n}"
    }
  },
  NC_2: {
    title: "Valid Anagram",
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
    difficulty: "EASY",
    tags: ["Arrays & Hashing"],
    constraints: "- 1 <= s.length, t.length <= 5 * 10^4",
    hints: "An anagram must have the same length and the same frequency of each character.",
    testcases: [
      { input: "2\nanagram\nnagaram", output: "true" },
      { input: "2\nrat\ncar", output: "false" }
    ],
    examples: { JAVASCRIPT: { input: "s=\"anagram\", t=\"nagaram\"", output: "true" }, PYTHON: { input: "s=\"rat\", t=\"car\"", output: "false" }, JAVA: { input: "s=\"rat\"", output: "false" }, CPP: { input: "s=\"rat\"", output: "false" } },
    codeSnippets: { JAVASCRIPT: "// Starter", PYTHON: "# Starter", JAVA: NC_SKELETONS.JAVA, CPP: NC_SKELETONS.CPP },
    referenceSolutions: {
        JAVASCRIPT: "function isAnagram(s, t) { if (s.length !== t.length) return false; return s.split('').sort().join('') === t.split('').sort().join(''); }\nfunction solveCase(rawInput) { const lines = rawInput.split(\"\\n\"); return isAnagram(lines[1] || \"\", lines[2] || \"\").toString(); }",
        PYTHON: "def solve_case(raw): \n    lines = raw.strip().split(\"\\n\")\n    s, t = lines[1], lines[2]\n    return \"true\" if sorted(s) == sorted(t) else \"false\"",
        JAVA: "import java.util.*;\npublic static String solveCase(String in) {\n    String[] lines = in.split(\"\\\\n\");\n    char[] s = lines[1].toCharArray(), t = lines[2].toCharArray();\n    Arrays.sort(s); Arrays.sort(t);\n    return Arrays.equals(s, t) ? \"true\" : \"false\";\n}",
        CPP: "#include <algorithm>\nstring solveCase(string in) {\n    stringstream ss(in); string dummy, s, t;\n    ss >> dummy >> s >> t;\n    sort(s.begin(), s.end()); sort(t.begin(), t.end());\n    return s == t ? \"true\" : \"false\";\n}"
    }
  },
  NC_3: {
    title: "Two Sum",
    description: "Find indices of two numbers that add up to target.",
    difficulty: "EASY",
    tags: ["Arrays & Hashing"],
    constraints: "2 <= nums.length <= 10^4",
    testcases: [{ input: "5\n2 7 11 15\n9", output: "[0,1]" }],
    examples: { JAVASCRIPT: { input: "[2,7], 9", output: "[0,1]" }, PYTHON: { input: "[2,7], 9", output: "[0,1]" }, JAVA: { input: "[2,7], 9", output: "[0,1]" }, CPP: { input: "[2,7], 9", output: "[0,1]" } },
    codeSnippets: { JAVASCRIPT: "// Starter", PYTHON: "# Starter", JAVA: NC_SKELETONS.JAVA, CPP: NC_SKELETONS.CPP },
    referenceSolutions: {
        JAVASCRIPT: "function solveCase(raw) {\n    const lines = raw.trim().split(\"\\n\");\n    const nums = lines[1].split(\" \").map(Number);\n    const target = Number(lines[2]);\n    const map = new Map();\n    for(let i=0; i<nums.length; i++) {\n        let diff = target - nums[i];\n        if(map.has(diff)) return `[${map.get(diff)},${i}]`;\n        map.set(nums[i], i);\n    }\n    return \"\";\n}",
        PYTHON: "import json\\ndef solve_case(raw):\\n    lines = raw.strip().split(\"\\n\")\\n    nums = list(map(int, lines[1].split()))\\n    target = int(lines[2])\\n    d = {}\\n    for i, n in enumerate(nums):\\n        diff = target - n\\n        if diff in d: return json.dumps([d[diff], i])\\n        d[n] = i",
        JAVA: "import java.util.*;\npublic static String solveCase(String in) {\n    Scanner sc = new Scanner(in);\n    int n = sc.nextInt(); int[] nums = new int[n];\n    for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n    int target = sc.nextInt();\n    Map<Integer, Integer> map = new HashMap<>();\n    for(int i=0; i<n; i++) {\n        int diff = target - nums[i];\n        if(map.containsKey(diff)) return \"[\" + map.get(diff) + \",\" + i + \"]\";\n        map.put(nums[i], i);\n    }\n    return \"\";\n}",
        CPP: "#include <unordered_map>\nstring solveCase(string in) {\n    stringstream ss(in); int n; ss >> n;\n    vector<int> nums(n); for(int i=0; i<n; i++) ss >> nums[i];\n    int target; ss >> target;\n    unordered_map<int, int> m;\n    for(int i=0; i<n; i++) {\n        int diff = target - nums[i];\n        if(m.count(diff)) return \"[\" + to_string(m[diff]) + \",\" + to_string(i) + \"]\";\n        m[nums[i]] = i;\n    }\n    return \"\";\n}"
    }
  },
  NC_4: {
    title: "Group Anagrams",
    description: "Group strings that are anagrams of each other.",
    difficulty: "MEDIUM",
    tags: ["Arrays & Hashing"],
    constraints: "1 <= strs.length <= 10^4",
    testcases: [{ input: "7\neat tea tan ate nat bat", output: "[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]" }],
    examples: { JAVASCRIPT: { input: "eat, tea", output: "[[\"eat\",\"tea\"]]" }, PYTHON: { input: "eat, tea", output: "[[\"eat\",\"tea\"]]" }, JAVA: { input: "eat, tea", output: "[[\"eat\",\"tea\"]]" }, CPP: { input: "eat, tea", output: "[[\"eat\",\"tea\"]]" } },
    codeSnippets: { JAVASCRIPT: "// Starter", PYTHON: "# Starter", JAVA: NC_SKELETONS.JAVA, CPP: NC_SKELETONS.CPP },
    referenceSolutions: {
        JAVASCRIPT: "function groupAnagrams(strs) {\n    const map = {};\n    for (let s of strs) {\n        const key = s.split('').sort().join('');\n        if (!map[key]) map[key] = [];\n        map[key].push(s);\n    }\n    return Object.values(map);\n}\nfunction solveCase(raw) {\n    const strs = raw.trim().split(\"\\n\")[1].split(\" \");\n    return JSON.stringify(groupAnagrams(strs));\n}",
        PYTHON: "import json\\ndef solve_case(raw):\\n    strs = raw.strip().split(\"\\n\")[1].split()\\n    d = {}\\n    for s in strs:\\n        k = \"\".join(sorted(s))\\n        d[k] = d.get(k, []) + [s]\\n    return json.dumps(list(d.values()))",
        JAVA: "import java.util.*;\npublic static String solveCase(String in) {\n    String[] lines = in.split(\"\\\\n\");\n    String[] strs = lines[1].split(\" \");\n    Map<String, List<String>> map = new HashMap<>();\n    for(String s : strs) {\n        char[] chars = s.toCharArray(); Arrays.sort(chars);\n        String key = new String(chars);\n        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n    }\n    return map.values().toString().replace(\" \", \"\");\n}",
        CPP: "#include <map> \nstring solveCase(string in) {\n    stringstream ss(in); int n; ss >> n;\n    map<string, vector<string>> m; \n    for(int i=0; i<n; i++) {\n        string s; ss >> s; string k = s; sort(k.begin(), k.end());\n        m[k].push_back(s);\n    }\n    string res = \"[\";\n    for(auto const& [k, v] : m) {\n        res += \"[\";\n        for(int i=0; i<v.size(); i++) res += \"\\\"\" + v[i] + \"\\\"\" + (i < v.size()-1 ? \",\" : \"\");\n        res += \"]\";\n    }\n    return res + \"]\";\n}"
    }
  },
  NC_5: {
    title: "Top K Frequent Elements",
    description: "Return the k most frequent elements.",
    difficulty: "MEDIUM",
    tags: ["Arrays & Hashing"],
    constraints: "k is in range [1, unique elements]",
    testcases: [{ input: "8\n1 1 1 2 2 3\n2", output: "[1,2]" }],
    examples: { JAVASCRIPT: { input: "[1,1,1,2,2,3], 2", output: "[1,2]" }, PYTHON: { input: "[1,1,1,2,2,3], 2", output: "[1,2]" }, JAVA: { input: "[1,1,1,2,2,3], 2", output: "[1,2]" }, CPP: { input: "[1,1,1,2,2,3], 2", output: "[1,2]" } },
    codeSnippets: { JAVASCRIPT: "// Starter", PYTHON: "# Starter", JAVA: NC_SKELETONS.JAVA, CPP: NC_SKELETONS.CPP },
    referenceSolutions: {
        JAVASCRIPT: "function solveCase(raw) {\n    const lines = raw.trim().split(\"\\n\");\n    const nums = lines[1].split(\" \").map(Number);\n    const k = parseInt(lines[2]);\n    const map = {}; for(let n of nums) map[n] = (map[n]||0) + 1;\n    const res = Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,k).map(x=>Number(x[0]));\n    return JSON.stringify(res.sort());\n}",
        PYTHON: "import json, collections\\ndef solve_case(raw):\\n    lines = raw.strip().split(\"\\n\")\\n    nums = list(map(int, lines[1].split()))\\n    k = int(lines[2])\\n    res = [x[0] for x in collections.Counter(nums).most_common(k)]\\n    return json.dumps(sorted(res))",
        JAVA: "import java.util.*;\npublic static String solveCase(String in) {\n    Scanner sc = new Scanner(in); int n = sc.nextInt();\n    Map<Integer, Integer> map = new HashMap<>();\n    for(int i=0; i<n; i++) { int v = sc.nextInt(); map.put(v, map.getOrDefault(v, 0)+1); }\n    int k = sc.nextInt();\n    List<Integer> list = new ArrayList<>(map.keySet());\n    list.sort((a, b) -> map.get(b) - map.get(a));\n    List<Integer> res = list.subList(0, k); Collections.sort(res);\n    return res.toString().replace(\" \", \"\");\n}",
        CPP: "#include <queue>\nstring solveCase(string in) {\n    stringstream ss(in); int n; ss >> n;\n    unordered_map<int, int> m; for(int i=0; i<n; i++) { int v; ss >> v; m[v]++; }\n    int k; ss >> k;\n    priority_queue<pair<int, int>> pq;\n    for(auto const& [val, freq] : m) pq.push({freq, val});\n    vector<int> res; for(int i=0; i<k; i++) { res.push_back(pq.top().second); pq.pop(); }\n    sort(res.begin(), res.end());\n    string s = \"[\"; for(int i=0; i<res.size(); i++) s += to_string(res[i]) + (i<res.size()-1 ? \",\" : \"\");\n    return s + \"]\";\n}"
    }
  }
};
