import { Code, Terminal, FileCode, Braces } from "lucide-react"
import { useEffect, useState } from "react"

interface CodeBackgroundProps {
  title: string;
  subtitle: string;
}

const CodeBackground: React.FC<CodeBackgroundProps> = ({ title, subtitle }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  // Code snippets to display in the background
  const codeSnippets = [
    `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`,
    `function isValid(s) {
  const stack = [];
  const map = {
    '(': ')',
    '{': '}',
    '[': ']'
  };
  
  for (let i = 0; i < s.length; i++) {
    if (s[i] in map) {
      stack.push(s[i]);
    } else {
      const last = stack.pop();
      if (map[last] !== s[i]) return false;
    }
  }
  
  return stack.length === 0;
}`,
  ]

  // Rotate through code snippets
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % codeSnippets.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [codeSnippets.length])

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-base-300/30 text-white p-12 relative overflow-hidden h-full">
      {/* Animated code symbols in background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        <div className="absolute top-[10%] left-[15%] animate-float">
          <Braces size={60} />
        </div>
        <div className="absolute top-[30%] left-[80%] animate-float-delayed">
          <FileCode size={70} />
        </div>
        <div className="absolute top-[70%] left-[20%] animate-float">
          <Terminal size={65} />
        </div>
        <div className="absolute top-[60%] left-[75%] animate-float-delayed">
          <Code size={75} />
        </div>
      </div>

       {/* Gradient Blobs */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10"></div>

      <div className="z-10 max-w-lg w-full flex flex-col items-center">
        {/* Code editor mockup */}
        <div className="w-full glass-panel rounded-2xl shadow-2xl mb-12 overflow-hidden border border-white/10 relative group transform hover:scale-[1.02] transition-transform duration-500">
           <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
          
          {/* Editor header */}
          <div className="bg-gray-900/50 px-4 py-3 flex items-center border-b border-white/5">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs font-mono text-gray-400">problem.js</div>
          </div>

          {/* Code content */}
          <div className="p-6 font-mono text-sm overflow-hidden relative h-80 bg-gray-900/90">
            <pre className="whitespace-pre-wrap text-green-400 transition-opacity duration-1000 leading-relaxed">
              {codeSnippets[activeIndex]}
            </pre>

            {/* Blinking cursor */}
            <div className="absolute bottom-6 right-6 w-2 h-4 bg-white animate-blink"></div>
          </div>
        </div>

        {/* Text content */}
        <div className="text-center space-y-4 max-w-md animate-fade-in-up">
            <h2 className="text-4xl font-bold font-display tracking-tight text-white mb-2">{title}</h2>
            <p className="text-lg text-base-content/70 leading-relaxed font-light">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

export default CodeBackground