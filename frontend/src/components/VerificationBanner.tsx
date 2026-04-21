import React, { useState } from "react";
import { ShieldAlert, Send, Loader2, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

/**
 * Verification Banner Component
 * A monochromatic, high-density warning displayed to unverified accounts.
 */
const VerificationBanner: React.FC = () => {
  const { authUser, resendVerification } = useAuthStore();
  const [isSending, setIsSending] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!authUser || authUser.isVerified || !isVisible) return null;

  const handleResend = async () => {
    setIsSending(true);
    try {
      await resendVerification();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 animate-in fade-in slide-in-from-top duration-500">
      <div className="workspace-container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-sm bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700">
            <ShieldAlert className="size-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 block leading-none mb-1">
              Email Verification Required
            </span>
            <p className="text-sm text-zinc-300 leading-tight">
              A verification link was sent to <span className="text-white font-mono">{authUser.email}</span>. 
              Verify your account to enable code execution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleResend}
            disabled={isSending}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-black px-4 py-1.5 rounded-sm text-xs font-bold hover:bg-zinc-200 transition-all disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
            Resend Link
          </button>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1.5 text-zinc-600 hover:text-white transition-colors"
            title="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationBanner;
