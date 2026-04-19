import { User, LogOut, Code2, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import BrutalistButton from "./BrutalistButton";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#0a0a0a]">
      <div className="max-w-350 mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-white p-1.5 rounded-sm group-hover:bg-accent transition-colors duration-300">
              <Code2 className="size-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tighter text-white font-display uppercase">
              AlgoPrep
            </span>
          </Link>

          {/* Main Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/explore"
              className={`nav-link ${isActive("/explore") ? "text-white bg-zinc-900 rounded-sm" : ""}`}
            >
              Problems
            </Link>
            <Link
              to="/playlists"
              className={`nav-link ${isActive("/playlists") ? "text-white bg-zinc-900 rounded-sm" : ""}`}
            >
              Playlists
            </Link>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {!authUser ? (
            <div className="flex items-center gap-4">
              <BrutalistButton 
                to="/login" 
                variant="outline" 
                size="sm"
              >
                Sign In
              </BrutalistButton>
              <BrutalistButton 
                to="/signup" 
                variant="primary" 
                size="sm"
              >
                Get Started
              </BrutalistButton>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white leading-none">
                    {authUser.name}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {authUser.role.toLowerCase()}
                  </p>
                </div>
                <div className="size-9 rounded-sm overflow-hidden border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                  <img
                    src={
                      authUser?.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        authUser?.name || "User",
                      )}&background=18181b&color=fff`
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content mt-4 z-1 p-2 shadow-2xl bg-[#0d0d0d] border border-zinc-800 rounded-sm w-64"
              >
                <div className="px-4 py-3 border-b border-zinc-800 mb-2">
                  <p className="text-sm font-medium text-white">
                    {authUser.name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {authUser.email}
                  </p>
                </div>

                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-sm transition-all text-zinc-300 hover:text-white"
                  >
                    <User className="size-4" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>
                </li>

                {authUser.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/add-problem"
                      className="flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-sm transition-all text-zinc-300 hover:text-white"
                    >
                      <LayoutDashboard className="size-4" />
                      <span className="text-sm font-medium">
                        Create Problem
                      </span>
                    </Link>
                  </li>
                )}

                <div className="h-px bg-zinc-800 my-2 mx-2" />

                <li>
                  <LogoutButton className="flex w-full items-center gap-3 p-3 hover:bg-red-500/10 rounded-sm transition-colors text-red-400 hover:text-red-300 group">
                    <LogOut className="size-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </LogoutButton>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
