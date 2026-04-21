import { useEffect, useState, useMemo } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader2, ArrowLeft } from "lucide-react";
import ProblemTable from "../components/ProblemTable";
import NC150Roadmap from "../components/NC150Roadmap";

const RoadmapPage = () => {
  const { getAllProblems, problems, isProblemsLoading, solvedProblems, getSolvedProblemByUser } = useProblemStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const NC_CATEGORIES = [
    "Arrays & Hashing", "Two Pointers", "Sliding Window", "Stack", "Binary Search",
    "Linked List", "Trees", "Tries", "Heap / Priority Queue", "Backtracking",
    "Graphs", "Advanced Graphs", "1-D Dynamic Programming", "2-D Dynamic Programming",
    "Greedy", "Intervals", "Math & Geometry", "Bit Manipulation"
  ];

  useEffect(() => {
    getAllProblems();
    getSolvedProblemByUser();
  }, [getAllProblems, getSolvedProblemByUser]);

  // Strictly filter only problems belonging to NeetCode 150 categories
  const nc150Problems = useMemo(() => {
    return problems.filter(p => p.tags?.some(tag => NC_CATEGORIES.includes(tag)));
  }, [problems]);

  const solvedIds = useMemo(() => {
    return new Set(solvedProblems.map(p => p.id));
  }, [solvedProblems]);

  const filteredByCategory = useMemo(() => {
    if (!selectedCategory) return [];
    return nc150Problems.filter(p => p.tags?.includes(selectedCategory));
  }, [nc150Problems, selectedCategory]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="size-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="border-b border-zinc-800 bg-[#0d0d0d] py-16 mb-8 relative overflow-hidden">
        <div className="workspace-container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-500">Roadmap</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white uppercase">
                {selectedCategory ? selectedCategory : "The Roadmap"}
              </h1>
              <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">
                {selectedCategory 
                  ? `Master every pattern in ${selectedCategory} to build an unbreakable foundation.`
                  : "Master algorithmic patterns with 150 hand-picked challenges designed to bridge the gap between intermediate and elite engineer."}
              </p>
            </div>
            
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all rounded-sm text-sm font-bold text-zinc-400 hover:text-white group"
              >
                <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                Back to Roadmap
              </button>
            )}
          </div>
        </div>
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      <div className="workspace-container">
        {/* Mastery Header Stats */}
        <div className="mb-12 bg-black border border-zinc-800 p-4 rounded-sm flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-32 bg-emerald-500/5 blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">Global Status</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">{solvedIds.size}</span>
                <span className="text-zinc-700 font-mono text-sm">/ 150</span>
              </div>
            </div>
            
            <div className="h-10 w-px bg-zinc-800 hidden sm:block"></div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">Rank</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-500 uppercase tracking-tighter">
                  {solvedIds.size === 150 ? "Master" : 
                   solvedIds.size > 100 ? "Expert" :
                   solvedIds.size > 50 ? "Intermediate" : "Novice"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md hidden lg:block">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Completion</span>
              <span className="text-[10px] font-mono text-zinc-400">{((solvedIds.size / 150) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-900 border border-zinc-800 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                style={{ width: `${(solvedIds.size / 150) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {!selectedCategory ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <NC150Roadmap 
              problems={nc150Problems}
              solvedProblemIds={solvedIds}
              onCategoryClick={setSelectedCategory}
              selectedCategory={selectedCategory}
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-2 duration-500">
            {filteredByCategory.length > 0 ? (
              <ProblemTable problems={filteredByCategory} />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-800 rounded-sm bg-[#0a0a0a]">
                  No Problems Found
                <p className="text-zinc-600 text-sm mt-2">
                  No core challenges have been deployed for this category yet.
                </p>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="mt-6 text-emerald-500 font-mono text-xs hover:underline uppercase tracking-widest"
                >
                  Return to Roadmap
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;
