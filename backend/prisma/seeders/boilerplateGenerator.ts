/**
 * Boilerplate Generator
 * Generates full, executable scripts from a function signature.
 * Includes the I/O boilerplate to satisfy the __ALGOPREP_CASE_START__ contract.
 */

export interface FunctionSignature {
  name: string;
  inputs: { name: string; type: string }[];
  output: string;
}

export function generateCpp(signature: FunctionSignature): string {
  return `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>

using namespace std;

class Solution {
public:
    // TODO: Implement ${signature.name}
    ${signature.output} ${signature.name}(${signature.inputs.map(i => `${i.type} ${i.name}`).join(", ")}) {
        
    }
};

int main() {
    int t;
    if (!(cin >> t)) return 0;
    while (t--) {
        int l;
        cin >> l;
        // Basic parser stub - in a full platform, this dynamically reads inputs based on signature
        // For array: read N, then N elements
        // For string: read string
        // This is a stub for the user to see the structure
        cout << "__ALGOPREP_CASE_START__\\n";
        // User's solution call would go here
        cout << "\\n__ALGOPREP_CASE_END__\\n";
    }
    return 0;
}
`;
}

export function generateJava(signature: FunctionSignature): string {
  return `import java.util.*;

class Solution {
    // TODO: Implement ${signature.name}
    public ${signature.output} ${signature.name}(${signature.inputs.map(i => `${i.type} ${i.name}`).join(", ")}) {
        
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNextInt()) return;
        int t = scanner.nextInt();
        while (t-- > 0) {
            int l = scanner.nextInt();
            System.out.println("__ALGOPREP_CASE_START__");
            // Basic parser stub
            System.out.println("");
            System.out.println("__ALGOPREP_CASE_END__");
        }
        scanner.close();
    }
}
`;
}

export function generatePython(signature: FunctionSignature): string {
  return `import sys
from typing import List, Dict, Set

class Solution:
    # TODO: Implement ${signature.name}
    def ${signature.name}(self, ${signature.inputs.map(i => `${i.name}: ${i.type}`).join(", ")}) -> ${signature.output}:
        pass

if __name__ == '__main__':
    input_data = sys.stdin.read().split()
    if not input_data:
        sys.exit()
    
    t = int(input_data[0])
    idx = 1
    for _ in range(t):
        if idx >= len(input_data): break
        l = int(input_data[idx])
        idx += 1
        
        print("__ALGOPREP_CASE_START__")
        # Basic parser stub
        print("")
        print("__ALGOPREP_CASE_END__")
`;
}

export function generateJavascript(signature: FunctionSignature): string {
  return `/**
 * @param {${signature.inputs.map(i => i.type).join(", ")}}
 * @return {${signature.output}}
 */
var ${signature.name} = function(${signature.inputs.map(i => i.name).join(", ")}) {
    
};

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
if (input.length === 0 || input[0] === '') process.exit(0);

const t = parseInt(input[0]);
let idx = 1;
for (let i = 0; i < t; i++) {
    if (idx >= input.length) break;
    const l = parseInt(input[idx++]);
    
    console.log("__ALGOPREP_CASE_START__");
    // Basic parser stub
    console.log("");
    console.log("__ALGOPREP_CASE_END__");
}
`;
}

export function generateBoilerplates(signature: FunctionSignature) {
  return {
    CPP: generateCpp(signature),
    JAVA: generateJava(signature),
    PYTHON: generatePython(signature),
    JAVASCRIPT: generateJavascript(signature)
  };
}
