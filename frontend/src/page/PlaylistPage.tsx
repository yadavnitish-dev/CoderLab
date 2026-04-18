import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Loader, Trash2, ArrowLeft } from "lucide-react";
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
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      await deletePlaylist(id);
      navigate("/profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (!currentPlaylist)
    return <div className="text-center mt-20">Playlist not found</div>;

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/profile" className="btn btn-ghost btn-sm mb-4 gap-2">
          <ArrowLeft className="size-4" /> Back to Profile
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-base-200 p-6 rounded-xl shadow-lg">
          <div>
            <h1 className="text-3xl font-bold">{currentPlaylist.name}</h1>
            {currentPlaylist.description && (
              <p className="text-base-content/70 mt-2">
                {currentPlaylist.description}
              </p>
            )}
            <div className="mt-2 text-sm text-base-content/60">
              {currentPlaylist.problems?.length || 0} Problems
            </div>
          </div>
          <button
            onClick={handleDeletePlaylist}
            className="btn btn-error text-white gap-2"
          >
            <Trash2 className="size-4" /> Delete Playlist
          </button>
        </div>

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
          <div className="text-center py-10 bg-base-200 rounded-xl border border-dashed border-base-content/20">
            <p className="text-lg font-medium text-base-content/60">
              This playlist is empty.
            </p>
            <Link to="/" className="btn btn-primary btn-sm mt-4">
              Browse Problems
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
