import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Trash2, ArrowLeft, ListMusic } from "lucide-react";
import ProblemTable from "../components/ProblemTable";
import Skeleton, { SkeletonTable } from "../components/Skeleton";

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getPlaylistDetails,
    currentPlaylist,
    isLoading,
    removeProblemFromPlaylist,
    deletePlaylist,
  } = usePlaylistStore();

  useEffect(() => {
    if (id) {
      getPlaylistDetails(id);
    }
  }, [getPlaylistDetails, id]);

  const handleRemoveProblem = async (problemId: string) => {
    if (!id) return;
    await removeProblemFromPlaylist(id, [problemId]);
  };

  const handleDeletePlaylist = async () => {
    if (!id) return;
    if (
      window.confirm(
        "Are you sure you want to delete this playlist? This action cannot be undone.",
      )
    ) {
      await deletePlaylist(id);
      navigate("/playlists");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 p-6">
        <div className="workspace-container space-y-6">
          <Skeleton width={300} height={48} />
          <Skeleton width={200} height={20} className="mb-8" />
          <SkeletonTable rows={5} cols={4} />
        </div>
      </div>
    );
  }

  if (!currentPlaylist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-zinc-400 font-medium mb-4">Playlist not found</p>
        <Link
          to="/playlists"
          className="text-white bg-zinc-900 border border-zinc-800 px-6 py-2 rounded-none text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
        >
          Back to Playlists
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <div className="border-b border-zinc-800 bg-[#0d0d0d] py-12 mb-8">
        <div className="workspace-container">
          <Link
            to="/playlists"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="size-3" />
            Back to Playlists
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-none text-zinc-400">
                  <ListMusic className="size-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Playlist Collection
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                {currentPlaylist.name}
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl">
                {currentPlaylist.description ||
                  "A curated study track for mastering specific algorithmic patterns."}
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              <div className="bg-black border border-zinc-800 px-4 py-2 rounded-none text-center min-w-25">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">
                  Challenges
                </p>
                <p className="text-lg font-bold text-white">
                  {currentPlaylist.problems?.length || 0}
                </p>
              </div>
              <button
                onClick={handleDeletePlaylist}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-none transition-colors"
                title="Delete Playlist"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="workspace-container">
        {currentPlaylist.problems && currentPlaylist.problems.length > 0 ? (
          <ProblemTable
            problems={currentPlaylist.problems.map((p) => ({
              ...p.problem,
              solvedBy: p.problem.solvedBy || [],
            }))}
            isPlaylist={true}
            onRemove={handleRemoveProblem}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border border-zinc-900 bg-[#080808]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              This playlist is empty
            </p>
            <Link
              to="/roadmap"
              className="mt-6 text-emerald-500 font-mono text-[10px] hover:text-emerald-400 uppercase tracking-widest transition-colors"
            >
              Browse Problems
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
