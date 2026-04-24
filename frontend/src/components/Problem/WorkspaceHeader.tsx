
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Type,
  Code2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import BrutalistSelect from "../BrutalistSelect";

interface WorkspaceHeaderProps {
  title: string;
  difficulty: string;
  fontSize: number;
  setFontSize: (size: number) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  codeSnippets: Record<string, string>;
  isLeftPaneVisible: boolean;
  setIsLeftPaneVisible: (visible: boolean) => void;
  getDisplayLanguage: (lang: string) => string;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  title,
  difficulty,
  fontSize,
  setFontSize,
  selectedLanguage,
  setSelectedLanguage,
  codeSnippets,
  isLeftPaneVisible,
  setIsLeftPaneVisible,
  getDisplayLanguage,
}) => {
  return (
    <header className="h-14 border-b border-zinc-800 bg-[#0d0d0d] px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <Link
          to="/roadmap"
          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm transition-all border border-transparent hover:border-zinc-700"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="h-4 w-px bg-zinc-800" />
        <h1 className="text-sm font-semibold text-zinc-200 truncate flex items-center gap-2">
          {title}
          <span
            className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-tighter ${
              difficulty === "EASY"
                ? "bg-emerald-500/10 text-emerald-500"
                : difficulty === "MEDIUM"
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-rose-500/10 text-rose-500"
            }`}
          >
            {difficulty}
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-black border border-zinc-800 rounded-sm p-1">
          <button
            onClick={() => setFontSize(Math.max(12, fontSize - 1))}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm transition-all"
          >
            <Minus className="size-3" />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            <Type className="size-3 text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-400 w-4 text-center">
              {fontSize}
            </span>
          </div>
          <button
            onClick={() => setFontSize(Math.min(24, fontSize + 1))}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm transition-all"
          >
            <Plus className="size-3" />
          </button>
        </div>

        <div className="h-4 w-px bg-zinc-800" />

        <BrutalistSelect
          className="min-w-35"
          icon={Code2}
          value={selectedLanguage}
          onChange={setSelectedLanguage}
          options={Object.keys(codeSnippets || {}).map((lang) => ({
            value: lang,
            label: getDisplayLanguage(lang),
          }))}
        />

        <button
          onClick={() => setIsLeftPaneVisible(!isLeftPaneVisible)}
          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm transition-all border border-transparent hover:border-zinc-700"
        >
          {isLeftPaneVisible ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </button>
      </div>
    </header>
  );
};

export default WorkspaceHeader;
