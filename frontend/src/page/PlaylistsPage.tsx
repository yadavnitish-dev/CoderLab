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
        <Loader2 className="size-8 animate-spin text-zinc-600" />
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
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-sm font-bold text-sm hover:bg-zinc-200 transition-all shrink-0 mb-1"
          >
             <Plus className="size-4" />
             Create Playlist
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
                className="group relative bg-[#090909] border border-zinc-800 rounded-sm p-6 hover:border-zinc-700 hover:bg-[#0d0d0d] transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="size-10 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                      <ListMusic className="size-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-sm bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:bg-zinc-800 group-hover:text-zinc-400 transition-colors">
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
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-800 rounded-sm bg-zinc-900/10">
            <ListMusic className="size-12 text-zinc-800 mb-4" />
            <h3 className="text-zinc-400 font-bold text-lg">No Playlists Yet</h3>
            <p className="text-zinc-600 text-sm mt-1 mb-8 text-center max-w-xs">
              Start by creating a playlist to organize your favorite problems
              and study tracks.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black px-8 py-3 rounded-sm font-bold text-sm hover:bg-zinc-200 transition-all"
            >
              Create Your First Playlist
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
