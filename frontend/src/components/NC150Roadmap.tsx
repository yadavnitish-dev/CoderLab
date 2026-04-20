import React from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { Problem } from '../types';

interface NC150RoadmapProps {
  problems: Problem[];
  solvedProblemIds: Set<string>;
  onCategoryClick: (category: string) => void;
  selectedCategory: string | null;
}

const NC_CATEGORIES = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Tries",
  "Heap / Priority Queue",
  "Backtracking",
  "Graphs",
  "Advanced Graphs",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation"
];

const NC150Roadmap: React.FC<NC150RoadmapProps> = ({ 
  problems, 
  solvedProblemIds, 
  onCategoryClick,
  selectedCategory 
}) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {NC_CATEGORIES.map((category) => {
        const categoryProblems = problems.filter(p => p.tags?.includes(category));
        
        // Skip empty categories if they are not part of the base 150 (but here we show all 18 for the roadmap feel)
        const total = categoryProblems.length;
        const solved = categoryProblems.filter(p => solvedProblemIds.has(p.id)).length;
        const percentage = total > 0 ? (solved / total) * 100 : 0;
        const isSelected = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => onCategoryClick(category)}
            className={`flex flex-col md:flex-row md:items-center justify-between p-6 border transition-all duration-200 group text-left rounded-sm ${
              isSelected 
                ? 'bg-zinc-900 border-zinc-500 ring-1 ring-zinc-500/50' 
                : 'bg-black border-zinc-900 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-6 mb-4 md:mb-0">
              {/* Category Number & Name */}
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest mb-1">
                  Track: {String(NC_CATEGORIES.indexOf(category) + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
                  {category}
                  {total > 0 && solved === total && (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  )}
                </h3>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
              <div className="flex items-center justify-between md:justify-end gap-4 w-full h-fit">
                {/* Progress Text */}
                <div className="flex items-baseline gap-1 font-mono">
                  <span className={`text-xl font-bold ${solved > 0 ? 'text-white' : 'text-zinc-700'}`}>
                    {String(solved).padStart(2, '0')}
                  </span>
                  <span className="text-zinc-700 text-xs">/</span>
                  <span className="text-zinc-600 font-bold">
                    {String(total).padStart(2, '0')}
                  </span>
                </div>
                
                <ChevronRight className={`size-5 text-zinc-700 group-hover:text-zinc-400 transition-all ${isSelected ? 'rotate-90 text-white' : ''}`} />
              </div>

              {/* Brutalist Progress Bar */}
              <div className="w-full md:w-48 h-2 bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    solved === total && total > 0 ? 'bg-emerald-500' : 'bg-zinc-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default NC150Roadmap;
