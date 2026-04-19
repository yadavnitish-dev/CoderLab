import { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader2 } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

const ExplorePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

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
      <div className="border-b border-zinc-800 bg-[#0d0d0d] py-16 mb-8">
        <div className="workspace-container">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Problem Library
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl">
            A curated collection of algorithmic challenges designed to push your
            problem-solving skills to the next level.
          </p>
        </div>
      </div>

      <div className="workspace-container">
        {problems.length > 0 ? (
          <ProblemTable problems={problems} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-800 rounded-sm bg-black">
            <p className="text-zinc-500 font-medium text-lg">
              No challenges available at the moment.
            </p>
            <p className="text-zinc-600 text-sm mt-1">
              Check back soon for new updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
