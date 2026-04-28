import { useEffect, useState, useMemo } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { ArrowLeft } from "lucide-react";
import ProblemTable from "../components/ProblemTable";
import NC150Roadmap from "../components/NC150Roadmap";
import Skeleton, { SkeletonTable, SkeletonCard } from "../components/Skeleton";

const NC_CATEGORIES = [
  "Arrays & Hashing", "Two Pointers", "Sliding Window", "Stack", "Binary Search",
  "Linked List", "Trees", "Tries", "Heap / Priority Queue", "Backtracking",
  "Graphs", "Advanced Graphs", "1-D Dynamic Programming", "2-D Dynamic Programming",
  "Greedy", "Intervals", "Math & Geometry", "Bit Manipulation"
];

const RoadmapPage = () => {
  const { getAllProblems, problems, isProblemsLoading, solvedProblems, getSolvedProblemByUser } = useProblemStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  // Stats Calculation
  const stats = useMemo(() => {
    const totalEasy = nc150Problems.filter(p => p.difficulty?.toUpperCase() === "EASY").length;
    const totalMedium = nc150Problems.filter(p => p.difficulty?.toUpperCase() === "MEDIUM").length;
    const totalHard = nc150Problems.filter(p => p.difficulty?.toUpperCase() === "HARD").length;

    const solvedEasy = solvedProblems.filter(p => p.difficulty?.toUpperCase() === "EASY").length;
    const solvedMedium = solvedProblems.filter(p => p.difficulty?.toUpperCase() === "MEDIUM").length;
    const solvedHard = solvedProblems.filter(p => p.difficulty?.toUpperCase() === "HARD").length;

    // Streak Logic
    const solveDates = [...new Set(solvedProblems.map(p => {
      // Access the createdAt from the joined solvedBy record we just added to the backend
      const solvedAt = p.solvedBy?.[0]?.createdAt;
      return solvedAt ? new Date(solvedAt).toDateString() : null;
    }).filter(Boolean))].map(d => new Date(d as string)).sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let bestStreak = 0;
    
    if (solveDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const firstSolve = new Date(solveDates[0]);
      firstSolve.setHours(0, 0, 0, 0);

      // Current Streak
      if (firstSolve.getTime() === today.getTime() || firstSolve.getTime() === yesterday.getTime()) {
        let tempStreak = 1;
        for (let i = 0; i < solveDates.length - 1; i++) {
          const current = new Date(solveDates[i]);
          current.setHours(0, 0, 0, 0);
          const next = new Date(solveDates[i + 1]);
          next.setHours(0, 0, 0, 0);
          
          const diff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            tempStreak++;
          } else {
            break;
          }
        }
        currentStreak = tempStreak;
      }

      // Best Streak
      let maxStreak = 1;
      let tempMax = 1;
      for (let i = 0; i < solveDates.length - 1; i++) {
        const current = new Date(solveDates[i]);
        current.setHours(0, 0, 0, 0);
        const next = new Date(solveDates[i + 1]);
        next.setHours(0, 0, 0, 0);
        
        const diff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          tempMax++;
        } else {
          maxStreak = Math.max(maxStreak, tempMax);
          tempMax = 1;
        }
      }
      bestStreak = Math.max(maxStreak, tempMax);
    }

    return {
      easy: { solved: solvedEasy, total: totalEasy },
      medium: { solved: solvedMedium, total: totalMedium },
      hard: { solved: solvedHard, total: totalHard },
      currentStreak,
      bestStreak
    };
  }, [nc150Problems, solvedProblems]);

  const filteredByCategory = useMemo(() => {
    if (!selectedCategory) return [];
    return nc150Problems.filter(p => p.tags?.includes(selectedCategory));
  }, [nc150Problems, selectedCategory]);

  if (isProblemsLoading) {
    return (
      <div className="min-h-screen pb-20 p-6">
        <div className="workspace-container space-y-8">
          <div className="border-b border-zinc-800 bg-[#0d0d0d] py-16">
            <div className="space-y-4">
              <Skeleton width={100} height={24} />
              <Skeleton width="60%" height={48} />
              <Skeleton width="40%" height={24} />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <SkeletonTable rows={8} cols={5} />
        </div>
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
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-none bg-zinc-900 border border-zinc-800 mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-500">Roadmap</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white uppercase">
                {selectedCategory ? selectedCategory : "The Roadmap"}
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
                {selectedCategory 
                  ? `Master every pattern in ${selectedCategory} to build an unbreakable foundation.`
                  : "Master algorithmic patterns with 150 hand-picked challenges designed to bridge the gap between intermediate and elite engineer."}
              </p>
            </div>
            
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors rounded-none text-sm font-bold text-zinc-400 hover:text-white group"
              >
                <ArrowLeft className="size-4" />
                Back to Roadmap
              </button>
            )}
          </div>
        </div>
        
        {/* Subdued Background overlay instead of glow */}
        <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"></div>
      </div>

      <div className="workspace-container">
        {/* Mastery Header Stats: Redesigned with circular progress and enhanced visuals */}
        <div className="mb-12 border border-zinc-800 bg-zinc-800 grid grid-cols-1 lg:grid-cols-4 gap-px overflow-hidden relative">
          {/* CRT Scanline Overlay for the entire stats block */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden z-10">
            <div className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent animate-scanline"></div>
          </div>
          
          {/* Main Progress - Large number with progress bar */}
          <div className="lg:col-span-1 bg-[#050505] p-6 flex flex-col justify-between relative group min-h-[180px]">
            <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em]">Overall Progress</p>
            <div className="mt-auto">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-mono font-bold text-white leading-none tracking-tighter">{solvedIds.size}</span>
                <span className="text-lg font-mono text-zinc-500">/ 150</span>
              </div>
              <div className="h-3 bg-zinc-900 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${(solvedIds.size / 150) * 100}%` }} 
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
                  {Math.round((solvedIds.size / 150) * 100)}% complete
                </span>
              </div>
            </div>
          </div>
          
          {/* Streak - Terminal style */}
          <div className="lg:col-span-1 bg-[#050505] p-6 flex flex-col justify-between relative group min-h-[180px]">
            <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em]">Streak</p>
            <div className="mt-auto font-mono">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">CURRENT:</span>
                <span className="text-3xl font-bold text-emerald-500">{stats.currentStreak}</span>
                <span className="text-[10px] text-zinc-500 uppercase">days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">BEST:</span>
                <span className="text-lg font-bold text-zinc-400">{stats.bestStreak}</span>
                <span className="text-[10px] text-zinc-500 uppercase">days</span>
              </div>
            </div>
          </div>

          {/* Difficulty breakdown - Visual badges */}
          <div className="lg:col-span-2 bg-[#050505] p-6 flex flex-col justify-between relative group min-h-[180px]">
            <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em]">Difficulty Breakdown</p>
            <div className="flex items-center justify-between mt-auto gap-4">
              {/* Easy Badge */}
              <div className="flex-1 bg-emerald-500/10 border border-emerald-500/30 p-4 text-center">
                <span className="block text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest mb-1">Easy</span>
                <span className="text-3xl font-mono font-bold text-white">{stats.easy.solved}</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">/ {stats.easy.total}</span>
              </div>

              {/* Medium Badge */}
              <div className="flex-1 bg-amber-500/10 border border-amber-500/30 p-4 text-center">
                <span className="block text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest mb-1">Medium</span>
                <span className="text-3xl font-mono font-bold text-white">{stats.medium.solved}</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">/ {stats.medium.total}</span>
              </div>

              {/* Hard Badge */}
              <div className="flex-1 bg-rose-500/10 border border-rose-500/30 p-4 text-center">
                <span className="block text-[10px] font-mono font-bold text-rose-500 uppercase tracking-widest mb-1">Hard</span>
                <span className="text-3xl font-mono font-bold text-white">{stats.hard.solved}</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">/ {stats.hard.total}</span>
              </div>
            </div>
          </div>
        </div>

        {!selectedCategory ? (
          <div className="space-y-8">
            <NC150Roadmap 
              problems={nc150Problems}
              solvedProblemIds={solvedIds}
              onCategoryClick={setSelectedCategory}
              selectedCategory={selectedCategory}
            />
          </div>
        ) : (
          <div>
            {filteredByCategory.length > 0 ? (
              <ProblemTable problems={filteredByCategory} />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 border border-zinc-900 bg-[#080808]">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  No challenges found
                </p>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="mt-6 text-emerald-500 font-mono text-[10px] hover:text-emerald-400 uppercase tracking-widest transition-colors"
                >
                  Back to Roadmap
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
