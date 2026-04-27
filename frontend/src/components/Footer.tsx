import { Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-zinc-900 py-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Copyright & Identity */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.3em]">
              AlgoPrep © 2026 — [ Nitish Kumar Yadav ]
            </p>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.1em]">
              Engineered for discipline over motivation.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <Link to="/roadmap" className="text-[10px] font-mono font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
              Product
            </Link>
            <a href="#" className="text-[10px] font-mono font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
              Docs
            </a>
            <a href="#" className="text-[10px] font-mono font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
              Contact
            </a>
            <a href="https://github.com/yadavnitish-dev" className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
              <Github className="size-3" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
