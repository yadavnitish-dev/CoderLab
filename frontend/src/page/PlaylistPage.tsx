import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Loader2, Trash2, ArrowLeft, ListMusic, Layers } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

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
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="size-8 animate-spin text-zinc-600" />
      </div>
    );
  }

  if (!currentPlaylist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-zinc-500 font-medium mb-4">Playlist not found</p>
        <Link
          to="/playlists"
          className="text-white bg-zinc-900 border border-zinc-800 px-6 py-2 rounded-sm text-sm font-bold"
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
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="size-3" />
            Back to Playlists
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-sm text-zinc-400">
                  <ListMusic className="size-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Playlist Collection
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                {currentPlaylist.name}
              </h1>
              <p className="text-zinc-500 text-lg max-w-2xl">
                {currentPlaylist.description ||
                  "A curated study track for mastering specific algorithmic patterns."}
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              <div className="bg-black border border-zinc-800 px-4 py-2 rounded-sm text-center min-w-25">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5">
                  Challenges
                </p>
                <p className="text-lg font-bold text-white">
                  {currentPlaylist.problems?.length || 0}
                </p>
              </div>
              <button
                onClick={handleDeletePlaylist}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-sm transition-all"
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
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-800 rounded-sm bg-zinc-900/10">
            <Layers className="size-12 text-zinc-800 mb-4" />
            <h3 className="text-zinc-400 font-bold text-lg">
              Empty Study Track
            </h3>
            <p className="text-zinc-600 text-sm mt-1 mb-8 text-center max-w-xs">
              This playlist doesn't have any challenges yet. Start browsing the
              library to add problems.
            </p>
            <Link
              to="/explore"
              className="bg-white text-black px-8 py-3 rounded-sm font-bold text-sm hover:bg-zinc-200 transition-all"
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
