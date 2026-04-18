import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus, ListMusic, Search, CheckCircle, Circle } from "lucide-react";
import { useActions } from "../store/useAction";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";


import { Problem } from "../types";

interface ProblemsTableProps {
  problems: Problem[];
  isPlaylist?: boolean;
  onRemove?: (id: string) => void;
}

const ProblemsTable: React.FC<ProblemsTableProps> = ({ problems, isPlaylist = false, onRemove }) => {
  const { authUser } = useAuthStore();
  const { onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  // Extract all unique tags from problems
  const uniqueTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set<string>();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);



  // Filter problems based on search, difficulty, and tags
  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id: string) => {
    onDeleteProblem(id);
  };

  const handleCreatePlaylist = async (data: any) => {
    await createPlaylist(data);
  };

  const handleAddToPlaylist = (problemId: string) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10">
      {/* Header with Create Playlist Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Problems</h2>
        <div className="flex gap-3">
          <Link to="/profile" className="btn btn-neutral gap-2">
            <ListMusic className="w-4 h-4" />
            My Playlists
          </Link>
          <button
            className="btn btn-primary gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create Playlist
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative">
             <input
                type="text"
                placeholder="Search problems..."
                className="input input-bordered w-full bg-base-100/50 focus:bg-base-100 transition-colors pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
        </div>
        
        <select
          className="select select-bordered w-full bg-base-100/50 focus:bg-base-100 transition-colors"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          {uniqueTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <select
          className="select select-bordered w-full bg-base-100/50 focus:bg-base-100 transition-colors"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="ALL">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        
        {/* Placeholder for future filter or clear button */}
         <button 
            className="btn btn-ghost text-base-content/60 hover:text-primary"
            onClick={() => {
                setSearch("");
                setSelectedTag("ALL");
                setDifficulty("ALL");
            }}
         >
             Clear Filters
         </button>
      </div>

      {/* Problems Table */}
      <div className="overflow-x-auto rounded-xl border border-base-content/5 bg-base-100/30">
        <table className="table table-lg w-full">
          {/* head */}
          <thead className="bg-base-200/50 backdrop-blur-sm text-base-content/60 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="py-4">Status</th>
              <th className="py-4">Title</th>
              <th className="py-4">Difficulty</th>
              <th className="py-4">Category</th>
              {authUser?.role === "ADMIN" && <th className="py-4 text-right">Actions</th>}
              <th className="py-4 text-right pl-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-content/5">
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const difficultyColor =
                  problem.difficulty === "Easy"
                    ? "badge-success text-success-content"
                    : problem.difficulty === "Medium"
                    ? "badge-warning text-warning-content"
                    : "badge-error text-error-content";
                
                const isSolved = problem.solvedBy && problem.solvedBy.some(
                    (user) => user.userId === authUser?.id
                  );

                return (
                  <tr key={problem.id} className="group hover:bg-base-content/[0.02] transition-colors duration-200">
                    <td className="w-16">
                      {isSolved ? (
                        <div className="tooltip" data-tip="Solved">
                           <CheckCircle className="text-success w-5 h-5 mx-auto" />
                        </div>
                      ) : (
                        <div className="tooltip" data-tip="Unsolved">
                          <Circle className="text-base-content/20 w-5 h-5 mx-auto" />
                        </div>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-semibold text-lg hover:text-primary transition-colors flex items-center gap-2"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td>
                      <span className={`badge ${difficultyColor} badge-sm font-medium border-none bg-opacity-20`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {problem.tags?.slice(0, 3).map((tag, i) => (
                           <span key={i} className="badge badge-ghost badge-sm text-base-content/60">
                             {tag}
                           </span>
                        ))}
                      </div>
                    </td>
                    {authUser?.role === "ADMIN" && (
                      <td className="text-right space-x-2">
                       <Link
                          to={`/problem/${problem.id}/edit`}
                          className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
                        >
                          <PencilIcon className="size-4" />
                        </Link>
                        <button
                          className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                          onClick={() => handleDelete(problem.id)}
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </td>
                    )}
                     <td className="text-right pl-4">
                       {
                          isPlaylist ? (
                               <button 
                                  className="btn btn-ghost btn-sm text-error gap-2 hover:bg-error/10"
                                  onClick={() => onRemove?.(problem.id)}
                              >
                                  <Trash className="w-4 h-4"/>
                                  <span className="hidden md:inline">Remove</span>
                               </button>
                          ) : (
                               <button
                                  className="btn btn-ghost btn-sm text-base-content/60 hover:text-primary hover:bg-primary/10 transition-all"
                                  onClick={() => handleAddToPlaylist(problem.id)}
                              >
                                  <Bookmark className="w-4 h-4" />
                              </button>
                          )
                       }
                     </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>
        <span className="btn btn-ghost btn-sm">
          {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
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