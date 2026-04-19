import { Code2, Github, Twitter, Linkedin, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-white p-1.5 rounded-sm group-hover:bg-emerald-500 transition-colors duration-300">
                <Code2 className="size-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white uppercase font-display">
                AlgoPrep
              </span>
            </Link>
            <p className="text-zinc-500 max-w-sm text-sm leading-relaxed">
              The high-performance workspace for mastering algorithms. 
              Precision-engineered for the modern problem solver.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                <Github className="size-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                <Twitter className="size-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                <Linkedin className="size-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600">Workspace</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/explore" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="size-1 rounded-full bg-zinc-800 group-hover:bg-emerald-500 transition-colors"></span>
                  Problems
                </Link>
              </li>
              <li>
                <Link to="/playlists" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="size-1 rounded-full bg-zinc-800 group-hover:bg-emerald-500 transition-colors"></span>
                  Playlists
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="size-1 rounded-full bg-zinc-800 group-hover:bg-emerald-500 transition-colors"></span>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Engine / Global Stats Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600">Runtime Engine</h4>
            <div className="space-y-4">
              <div className="p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-sm group hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest leading-none">Judge0 Cluster</span>
                  <div className="size-2 rounded-sm bg-emerald-500 animate-pulse"></div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-xl font-mono font-bold text-white tracking-tighter">100%</span>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase">Availability</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-500">Node: us-east-1</span>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-sm group hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest leading-none">Laboratory Activity</span>
                  <Activity className="size-3 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-xl font-mono font-bold text-white tracking-tighter">24.5k+</span>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase">Executions Today</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-500">Latency: 120ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
            © 2026 Nitish Kumar Yadav — [ ALGORITHMIC EVOLUTION ]
          </p>
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
            <span>Crafted with ♥ using</span>
            <span className="text-zinc-400">React, TypeScript & Judge0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
