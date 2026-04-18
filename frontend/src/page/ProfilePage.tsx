import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Mail, Calendar, Award, ListMusic } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useProblemStore } from "../store/useProblemStore";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const { getSolvedProblemByUser, solvedProblems } = useProblemStore();
  const { getAllPlaylists, playlists } = usePlaylistStore();

  useEffect(() => {
    getSolvedProblemByUser();
    getAllPlaylists();
  }, [getSolvedProblemByUser, getAllPlaylists]);

  if (!authUser) return null;

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel rounded-xl p-6 h-fit">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gradient">
                  My Profile
                </h1>
              </div>

              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img
                    src={
                      authUser.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        authUser.name || "User"
                      )}&background=random`
                    }
                    alt="Profile"
                    className="size-28 rounded-full object-cover border-4 border-base-100 shadow-xl relative z-10"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{authUser.name}</h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span
                      className={`badge ${
                        authUser.role === "ADMIN"
                          ? "badge-error"
                          : "badge-primary"
                      } badge-sm uppercase font-bold tracking-wider`}
                    >
                      {authUser.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-3">
                 <div className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3 text-base-content/70">
                        <Mail className="size-4 text-primary" />
                        <span>Email</span>
                    </div>
                    <span className="font-medium truncate max-w-[150px]">{authUser.email}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3 text-base-content/70">
                        <Calendar className="size-4 text-secondary" />
                        <span>Joined</span>
                    </div>
                    <span className="font-medium">{new Date(authUser.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>
            </div>

             {/* Stats Card */}
            <div className="glass-panel rounded-xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Award className="size-24 text-secondary" />
                 </div>
                 <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-white/5 pb-3 mb-4 relative z-10">
                    <Award className="w-5 h-5 text-secondary"/>
                     Stats
                </h3>
                 <div className="flex items-center justify-between py-2 relative z-10">
                  <div className="flex items-center gap-3">
                    <Award className="size-4 text-base-content/60" />
                    <span>Problems Solved</span>
                  </div>
                  <span className="font-bold text-3xl text-primary font-display">
                    {solvedProblems?.length || 0}
                  </span>
                </div>
                <div className="bg-base-300/30 backdrop-blur-sm p-3 rounded-lg mt-4 border border-white/5 relative z-10">
                    <p className="text-xs text-base-content/60 text-center italic">
                        "Consistency is the key to mastery. Keep solving!"
                    </p>
                </div>
            </div>
          </div>

          {/* Right Column: Playlists */}
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-xl p-6 h-full">
              <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
                <ListMusic className="w-5 h-5 text-accent" />
                My Playlists
              </h3>

              {playlists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {playlists.map((playlist) => (
                    <Link
                      key={playlist.id}
                      to={`/playlist/${playlist.id}`}
                      className="group block p-4 bg-base-100/50 rounded-xl hover:shadow-lg transition-all border border-white/5 hover:border-primary/50 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-start justify-between h-full relative z-10">
                        <div className="flex-1 min-w-0 mr-2"> 
                          <h4 className="font-semibold text-lg group-hover:text-primary transition-colors truncate font-display">
                            {playlist.name}
                          </h4>
                          <p className="text-sm text-base-content/70 mt-1 line-clamp-2">
                            {playlist.description || "No description"}
                          </p>
                        </div>
                        <span className="badge badge-sm badge-neutral group-hover:badge-primary transition-colors whitespace-nowrap">
                          {playlist.problems?.length || 0} problems
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-base-100/20">
                  <ListMusic className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium text-base-content/60">No playlists created yet.</p>
                  <Link to="/" className="btn btn-primary btn-sm mt-6 rounded-full px-6">
                    Create Your First Playlist
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
