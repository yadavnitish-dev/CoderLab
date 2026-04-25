import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Loader2, Plus, ListMusic, ChevronRight } from "lucide-react";
import CreatePlaylistModal from "../components/CreatePlaylistModal";

const PlaylistsPage = () => {
  const { getAllPlaylists, playlists, isLoading, createPlaylist } = usePlaylistStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAllPlaylists();
  }, [getAllPlaylists]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <p className="font-mono text-sm text-zinc-600 uppercase tracking-widest animate-blink">
          [ LOADING_PLAYLISTS ]
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Subtle Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-zinc-800 bg-[#0d0d0d] py-16 mb-8">
        <div className="workspace-container flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              My Playlists
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Organize your challenges into custom collections to track your
              progress and master specific topics.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-none font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 transition-colors shrink-0 mb-1"
          >
             <Plus className="size-4" />
             [ CREATE_PLAYLIST ]
          </button>
        </div>
      </div>

      <div className="workspace-container">
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="group relative bg-[#090909] border border-zinc-800 rounded-none p-6 hover:border-zinc-700 hover:bg-[#0c0c0c] transition-colors"
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="size-10 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                      <ListMusic className="size-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-none bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:bg-zinc-800 group-hover:text-zinc-400 transition-colors">
                      {playlist.problems?.length || 0} Challenges
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                    {playlist.name}
                  </h3>

                  <p className="text-zinc-500 text-sm line-clamp-2 mb-8 flex-1">
                    {playlist.description || "A custom collection of algorithmic problems."}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    View Contents
                    <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border border-zinc-900 bg-[#080808]">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  [ STATUS: NO_PLAYLISTS_FOUND ]
                </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 text-emerald-500 font-mono text-[10px] hover:text-emerald-400 uppercase tracking-widest transition-colors"
            >
              [ INITIALIZE_PLAYLIST ]
            </button>
          </div>
        )}
        <CreatePlaylistModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          await createPlaylist(data);
          getAllPlaylists();
        }}
      />
    </div>
    </div>
  );
};

export default PlaylistsPage;
