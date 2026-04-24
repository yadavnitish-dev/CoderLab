
import React from "react";
import Editor from "@monaco-editor/react";
import { Code2, Clock } from "lucide-react";

interface CodeEditorProps {
  selectedLanguage: string;
  code: string;
  setCode: (code: string) => void;
  fontSize: number;
  isResizing: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  selectedLanguage,
  code,
  setCode,
  fontSize,
  isResizing,
}) => {
  return (
    <div className="flex-1 bg-black border border-zinc-800 rounded-sm overflow-hidden flex flex-col">
      <div className="px-4 py-2.5 bg-[#111] border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Code2 className="size-3.5 text-zinc-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Main.
            {selectedLanguage.toLowerCase().includes("python") ? "py" : "ts"}
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
        {/* Prevent editor interaction while resizing */}
        {isResizing && (
          <div className="absolute inset-0 z-50 cursor-col-resize" />
        )}
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
  );
};

export default CodeEditor;
