import { Github, Chrome } from "lucide-react";
import BrutalistButton from "./BrutalistButton";

/**
 * SocialAuthButtons Component
 * Provides Google and GitHub sign-in options
 * Optimized for the "Engineer's Lab" monochromatic aesthetic
 */
const SocialAuthButtons = () => {
  const handleSocialLogin = (provider: "google" | "github") => {
    // Direct browser redirect for OAuth flow
    const backendUrl = import.meta.env.MODE === "development" 
      ? "http://localhost:8080/api/v1" 
      : "/api/v1";
    
    window.location.href = `${backendUrl}/auth/${provider}`;
  };

  return (
    <div className="space-y-3 w-full">
      <div className="relative flex items-center justify-center my-6">
        <div className="flex-grow border-t border-zinc-800"></div>
        <span className="flex-shrink mx-4 text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
          or continue with
        </span>
        <div className="flex-grow border-t border-zinc-800"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <BrutalistButton
          type="button"
          variant="secondary"
          size="md"
          className="w-full flex items-center justify-center gap-2 group"
          onClick={() => handleSocialLogin("google")}
        >
          <Chrome className="size-4 text-zinc-400 group-hover:text-white transition-colors" />
          <span className="text-xs font-bold uppercase tracking-tight">Google</span>
        </BrutalistButton>

        <BrutalistButton
          type="button"
          variant="secondary"
          size="md"
          className="w-full flex items-center justify-center gap-2 group"
          onClick={() => handleSocialLogin("github")}
        >
          <Github className="size-4 text-zinc-400 group-hover:text-white transition-colors" />
          <span className="text-xs font-bold uppercase tracking-tight">GitHub</span>
        </BrutalistButton>
      </div>
    </div>
  );
};

export default SocialAuthButtons;
