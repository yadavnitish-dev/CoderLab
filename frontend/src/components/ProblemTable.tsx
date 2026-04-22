import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Bookmark,
  PencilIcon,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useActions } from "../store/useAction";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Problem } from "../types";
import BrutalistSelect from "./BrutalistSelect";

interface ProblemsTableProps {
  problems: Problem[];
  isPlaylist?: boolean;
  onRemove?: (id: string) => void;
}

const ProblemsTable: React.FC<ProblemsTableProps> = ({
  problems,
  isPlaylist: _isPlaylist = false,
  onRemove: _onRemove,
}) => {
  const { authUser } = useAuthStore();
  const { onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null,
  );


  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty,
      );
  }, [problems, search, difficulty]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredProblems, currentPage]);

  return (
    <div className="w-full">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-end justify-between">
        <div className="flex flex-wrap gap-4 flex-1 w-full md:w-auto">
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search problems..."
              className="w-full bg-black border border-zinc-800 rounded-sm pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>


          <BrutalistSelect
            className="flex-1 md:flex-none md:min-w-40"
            options={[
              { value: "ALL", label: "All Difficulties" },
              { value: "EASY", label: "Easy" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HARD", label: "Hard" },
            ]}
            value={difficulty}
            onChange={setDifficulty}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-sm text-sm font-semibold hover:bg-zinc-200 transition-colors"
          >
            <Plus className="size-4" />
            New Playlist
          </button>
        </div>
      </div>

      {/* Table Shell */}
      <div className="bg-black border border-zinc-800 rounded-sm overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-[#0d0d0d]">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 w-16">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                Title
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 w-32">
                Difficulty
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50">
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const difficultyClass =
                  problem.difficulty === "EASY"
                    ? "!bg-emerald-500/10 !text-emerald-400"
                    : problem.difficulty === "MEDIUM"
                      ? "!bg-amber-500/10 !text-amber-400"
                      : "!bg-rose-500/10 !text-rose-400";
                const isSolved = problem.solvedBy?.some(
                  (u) => u.userId === authUser?.id,
                );

                return (
                  <tr
                    key={problem.id}
                    className="group hover:bg-[#050505] transition-colors"
                  >
                    <td className="px-6 py-5">
                      {isSolved ? (
                        <CheckCircle2 className="size-5 text-emerald-500/80" />
                      ) : (
                        <Circle className="size-5 text-zinc-800" />
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        to={`/problem/${problem.id}`}
                        className="text-zinc-200 font-medium hover:text-white transition-colors block"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${difficultyClass}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {authUser?.role === "ADMIN" && (
                          <>
                            <Link
                              to={`/problem/${problem.id}/edit`}
                              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-sm transition-all"
                            >
                              <PencilIcon className="size-4" />
                            </Link>
                            <button
                              onClick={() => onDeleteProblem(problem.id)}
                              className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-sm transition-all"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedProblemId(problem.id);
                            setIsAddToPlaylistModalOpen(true);
                          }}
                          className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 rounded-sm transition-all"
                        >
                          <Bookmark className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-20 text-center text-zinc-600 italic"
                >
                  No matching challenges found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 px-2">
          <p className="text-xs text-zinc-600 font-medium">
            Showing{" "}
            <span className="text-zinc-400">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="text-zinc-400">
              {Math.min(currentPage * itemsPerPage, filteredProblems.length)}
            </span>{" "}
            of <span className="text-zinc-400">{filteredProblems.length}</span>{" "}
            results
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 border border-zinc-800 rounded-sm text-zinc-500 hover:text-white hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex items-center px-4 h-9 border border-zinc-800 rounded-sm bg-black text-xs font-bold text-zinc-300">
              {currentPage} / {totalPages}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 border border-zinc-800 rounded-sm text-zinc-500 hover:text-white hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (data: { name: string; description: string }) => {
          await createPlaylist(data);
        }}
      />
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemsTable;
