import { useEffect, useState } from 'react';
import { X, Plus, Loader, ListMusic, Check } from 'lucide-react';
import { usePlaylistStore } from '../store/usePlaylistStore';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string | null;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ isOpen, onClose, problemId }) => {
  const { playlists, getAllPlaylists, addProblemToPlaylist, isLoading } = usePlaylistStore();
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  useEffect(() => {
    if (isOpen) {
      getAllPlaylists();
      setSelectedPlaylist(''); // Reset selection when opening
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/10 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-white/5">
          <h3 className="text-xl font-bold flex items-center gap-2 text-white">
            <ListMusic className="w-5 h-5 text-primary" />
            Add to Playlist
          </h3>
          <button 
            onClick={onClose} 
            className="btn btn-ghost btn-sm btn-circle hover:bg-white/10 text-base-content/60 hover:text-white transition-colors"
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
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <div 
                            key={playlist.id}
                            onClick={() => setSelectedPlaylist(playlist.id)}
                            className={`p-3 rounded-xl border border-white/5 cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                                selectedPlaylist === playlist.id 
                                    ? 'bg-primary/20 border-primary/50 shadow-lg shadow-primary/10' 
                                    : 'bg-base-300/30 hover:bg-base-300/50 hover:border-white/20'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${selectedPlaylist === playlist.id ? 'bg-primary' : 'bg-base-content/30'}`}></div>
                                <span className={`font-medium ${selectedPlaylist === playlist.id ? 'text-white' : 'text-base-content/80'}`}>
                                    {playlist.name}
                                </span>
                            </div>
                            {selectedPlaylist === playlist.id && <Check className="w-4 h-4 text-primary" />}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-base-content/50 bg-base-300/20 rounded-xl border border-dashed border-white/5">
                        <p>No playlists found</p>
                    </div>
                )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
                type="button" 
                onClick={onClose} 
                className="btn btn-ghost flex-1 hover:bg-white/5 font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-1 shadow-lg shadow-primary/20"
              disabled={!selectedPlaylist || isLoading}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
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