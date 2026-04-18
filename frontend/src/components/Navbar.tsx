import { User, Code, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import leetLabLogo from "../assets/leetlab.svg";
import LogoutButton from "./LogoutButton";



const Navbar = ()=>{

    const {authUser} = useAuthStore()

    return (
     <nav className="sticky top-0 z-50 w-full py-4 px-4">
      <div className="flex w-full justify-between items-center mx-auto max-w-[1600px] glass-panel p-3 rounded-2xl">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer pl-2">
          <div className="bg-primary/10 p-2 rounded-xl">
             <img src={leetLabLogo} className="size-8" alt="Logo" />
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight text-white hidden md:block font-display">
            AlgoPrep
          </span>
        </Link>

        {/* User Profile and Dropdown */}
        <div className="flex items-center gap-4 pr-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-white/10 hover:border-primary/50 transition-colors">
              <div className="w-10 rounded-full">
                <img
                  src={
                    authUser?.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      authUser?.name || "User"
                    )}&background=random`
                  }
                  alt="User Avatar"
                  className="object-cover"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow-2xl bg-base-200/90 backdrop-blur-md rounded-xl w-60 border border-white/5"
            >
              <li className="menu-title px-4 py-2 text-base-content/50 uppercase text-xs font-bold tracking-wider">
                Logged in as
              </li>
              <li className="px-4 pb-2 mb-2 border-b border-white/5">
                 <span className="font-semibold text-white truncate block w-full">{authUser?.name}</span>
                 <span className="text-xs text-base-content/60 truncate block w-full">{authUser?.email}</span>
              </li>
              
              <li>
                <Link
                    to="/explore"
                    className="py-3 hover:bg-primary/10 hover:text-primary font-medium"
                    onClick={() => {
                        const elem = document.activeElement as HTMLElement;
                        if (elem) {
                          elem?.blur();
                        }
                      }}
                >
                    <Code className="w-4 h-4" />
                    Explore
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="py-3 hover:bg-primary/10 hover:text-primary font-medium"
                  onClick={() => {
                    const elem = document.activeElement as HTMLElement;
                    if (elem) {
                      elem?.blur();
                    }
                  }}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
              </li>
              {authUser?.role === "ADMIN" && (
                <li>
                  <Link
                    to="/add-problem"
                    className="py-3 hover:bg-primary/10 hover:text-primary font-medium"
                    onClick={() => {
                        const elem = document.activeElement as HTMLElement;
                        if (elem) {
                          elem?.blur();
                        }
                      }}
                  >
                    <Code className="w-4 h-4" />
                    Add Problem
                  </Link>
                </li>
              )}
              <li className="mt-1 border-t border-white/5 pt-1">
                <LogoutButton 
                    className="py-3 hover:bg-error/10 hover:text-error font-medium text-error"
                    onClick={() => {
                        const elem = document.activeElement as HTMLElement;
                        if (elem) {
                          elem?.blur();
                        }
                      }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    )
}


export default Navbar;