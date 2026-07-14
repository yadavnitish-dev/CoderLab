import { LogOut, Code2, LayoutDashboard, Settings, Menu, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import LogoutButton from "./LogoutButton";
import BrutalistButton from "./BrutalistButton";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-zinc-900 border border-zinc-800 p-1.5 rounded-none group-hover:border-zinc-500 transition-none">
              <Code2 className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tighter text-white font-display uppercase">
              AlgoPrep
            </span>
          </Link>

          {/* Main Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/roadmap"
              className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-none ${isActive("/roadmap") ? "text-white border-b-2 border-emerald-500" : "text-zinc-400 hover:text-zinc-300 hover:border-b-2 hover:border-zinc-700"}`}
            >
              Roadmap
            </Link>
            <Link
              to="/playlists"
              className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-none ${isActive("/playlists") ? "text-white border-b-2 border-emerald-500" : "text-zinc-400 hover:text-zinc-300 hover:border-b-2 hover:border-zinc-700"}`}
            >
              Playlists
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-6">
          {!authUser ? (
            <div className="flex items-center gap-4">
              <BrutalistButton 
                to="/login" 
                variant="outline" 
                size="sm"
              >
                Login
              </BrutalistButton>
              <BrutalistButton 
                to="/signup" 
                variant="primary" 
                size="sm"
                className="h-9 px-6"
              >
                Start Solving
              </BrutalistButton>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                    {authUser.name}
                  </p>
                </div>
                <div className="size-8 rounded-none overflow-hidden border border-zinc-800 group-hover:border-zinc-700 transition-none">
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
                className="dropdown-content mt-4 z-1 p-2 shadow-none bg-[#0d0d0d] border border-zinc-800 rounded-none w-64"
              >
                <div className="px-4 py-3 border-b border-zinc-800 mb-2">
                  <p className="text-sm font-bold text-white">
                    {authUser.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate uppercase tracking-widest mt-1">
                    {authUser.email}
                  </p>
                </div>

                <li>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-none transition-none text-zinc-300 hover:text-white"
                  >
                    <LayoutDashboard className="size-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-none transition-none text-zinc-300 hover:text-white"
                  >
                    <Settings className="size-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
                  </Link>
                </li>

                {authUser.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/add-problem"
                      className="flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-none transition-none text-zinc-300 hover:text-white"
                    >
                      <LayoutDashboard className="size-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Create Problem
                      </span>
                    </Link>
                  </li>
                )}

                <div className="h-px bg-zinc-800 my-2 mx-2" />

                <li>
                  <LogoutButton className="flex w-full items-center gap-3 p-3 hover:bg-red-500/10 rounded-none transition-none text-red-400 hover:text-red-300 group">
                    <LogOut className="size-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                  </LogoutButton>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0a0a0a] p-4 space-y-4">
          <Link
            to="/roadmap"
            className={`block px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] ${isActive("/roadmap") ? "text-emerald-500 bg-zinc-900" : "text-zinc-400"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Roadmap
          </Link>
          <Link
            to="/playlists"
            className={`block px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] ${isActive("/playlists") ? "text-emerald-500 bg-zinc-900" : "text-zinc-400"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Playlists
          </Link>
          {authUser && (
            <>
              <Link
                to="/dashboard"
                className="block px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
