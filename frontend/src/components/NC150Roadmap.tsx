import { FC, Fragment } from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { Problem } from '../types';
import RoadmapConnector from './RoadmapConnector';

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

const NC150Roadmap: FC<NC150RoadmapProps> = ({ 
  problems, 
  solvedProblemIds, 
  onCategoryClick,
  selectedCategory 
}) => {
  return (
    <div className="flex flex-col">
      {NC_CATEGORIES.map((category, index) => {
        const categoryProblems = problems.filter(p => p.tags?.includes(category));
        const total = categoryProblems.length;
        const solved = categoryProblems.filter(p => solvedProblemIds.has(p.id)).length;
        const percentage = total > 0 ? (solved / total) * 100 : 0;
        const isSelected = selectedCategory === category;
        const isCompleted = total > 0 && solved === total;

        return (
          <Fragment key={category}>
            <button
              onClick={() => onCategoryClick(category)}
              className={`flex flex-col md:flex-row md:items-center justify-between p-6 border transition-all duration-300 group text-left rounded-sm relative z-10 ${
                isSelected 
                  ? 'bg-zinc-900 border-zinc-500 shadow-[0_0_20px_rgba(39,39,42,0.5)]' 
                  : 'bg-black border-zinc-900 hover:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-6 mb-4 md:mb-0">
                {/* Node Status Indicator */}
                <div className={`size-10 shrink-0 rounded-none border flex items-center justify-center transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                    : isSelected 
                      ? 'bg-white border-white text-black' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    <span className="text-xs font-mono font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    {category}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                <div className="flex items-center justify-between md:justify-end gap-4 w-full h-fit">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[9px] font-mono text-zinc-600 uppercase">Completed</span>
                      <span className="text-[11px] font-mono text-zinc-400">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-24 h-1.5 bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-zinc-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  
                  <ChevronRight className={`size-5 text-zinc-700 group-hover:text-zinc-400 transition-all ${isSelected ? 'rotate-90 text-white' : ''}`} />
                </div>
              </div>
            </button>
            
            {/* Connection Stem */}
            {index < NC_CATEGORIES.length - 1 && (
              <RoadmapConnector active={isCompleted} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default NC150Roadmap;
