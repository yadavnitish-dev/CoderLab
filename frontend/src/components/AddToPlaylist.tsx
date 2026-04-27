import { useEffect, useState } from "react";
import { X, Plus, ListMusic, Check } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import Skeleton from "./Skeleton";

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string | null;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  problemId,
}) => {
  const { playlists, getAllPlaylists, addProblemToPlaylist, isLoading } =
    usePlaylistStore();
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  // Reset selection when modal is not open
  if (!isOpen && selectedPlaylist !== "") {
    setSelectedPlaylist("");
  }

  useEffect(() => {
    if (isOpen) {
      getAllPlaylists();
    }
  }, [isOpen, getAllPlaylists]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlaylist || !problemId) return;

    await addProblemToPlaylist(selectedPlaylist, [problemId]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-none">
      <div className="bg-[#0d0d0d] border border-zinc-800 w-full max-w-md rounded-none overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-zinc-800 bg-zinc-900/50">
          <h3 className="text-xl font-bold flex items-center gap-2 text-white">
            <ListMusic className="w-5 h-5 text-primary" />
            Add to Playlist
          </h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-white/10 text-base-content/60 hover:text-white transition-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="text-sm font-semibold text-base-content/70 mb-3 block uppercase tracking-wide">
              Select Playlist
            </label>

            <div className="space-y-2 max-h-75 overflow-y-auto custom-scrollbar pr-1">
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() => setSelectedPlaylist(playlist.id)}
                    className={`p-3 rounded-none border cursor-pointer transition-none flex items-center justify-between group ${
                      selectedPlaylist === playlist.id
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-black border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-none ${selectedPlaylist === playlist.id ? "bg-emerald-500" : "bg-zinc-800"}`}
                      ></div>
                      <span
                        className={`font-medium text-sm ${selectedPlaylist === playlist.id ? "text-emerald-400" : "text-zinc-400"}`}
                      >
                        {playlist.name}
                      </span>
                    </div>
                    {selectedPlaylist === playlist.id && (
                      <Check className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-500 bg-black rounded-none border border-dashed border-zinc-800">
                  <p className="text-sm">No playlists found</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
               type="button"
               onClick={onClose}
               className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-none font-medium text-sm flex-1 transition-none"
             >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-white text-black px-6 py-2.5 rounded-none font-bold text-sm hover:bg-zinc-200 transition-none flex items-center justify-center gap-2 flex-1 italic lg:not-italic"
              disabled={!selectedPlaylist || isLoading}
            >
              {isLoading ? (
                <Skeleton width={16} height={16} className="inline-block" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
