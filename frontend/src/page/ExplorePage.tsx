import { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

const ExplorePage = () => {
    const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

    useEffect(() => {
        getAllProblems();
    }, [getAllProblems]);

    if (isProblemsLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20 px-4 pb-10">
            <div className="max-w-[1600px] mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gradient mb-2">Explore Problems</h1>
                <p className="text-base-content/60">Practice and master algorithms with our curated list of problems.</p>
            </div>
            
            <div className="glass-panel rounded-3xl p-1 md:p-8 relative z-10">
                 {
                    problems.length > 0 ? <ProblemTable problems={problems}/> : (
                        <div className="text-center py-20 border border-dashed border-base-content/10 rounded-2xl bg-base-200/30">
                          <p className="text-lg font-semibold text-base-content/50">
                            No problems found
                          </p>
                        </div>
                    )
                }
            </div>
            </div>
        </div>
    );
};

export default ExplorePage;
