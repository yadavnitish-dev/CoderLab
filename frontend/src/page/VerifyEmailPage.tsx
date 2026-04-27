import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ShieldCheck, ShieldAlert, ArrowRight } from "lucide-react";
import Skeleton from "../components/Skeleton";

/**
 * Verify Email Page
 * Catch-all landing page for identity verification links.
 */
const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="size-16 mx-auto rounded-none bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
            <ShieldAlert className="size-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Invalid Link</h1>
          <p className="text-zinc-400 text-sm">
            No verification token detected. Please use the link sent to your email.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-white bg-zinc-900 border border-zinc-800 px-6 py-2.5 rounded-none text-xs font-bold hover:bg-zinc-800 transition-none">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="header text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-8">
          AlgoPrep // Email Verification
        </div>

        {isCheckingAuth ? (
          <div className="space-y-6">
            <Skeleton variant="rectangular" width={48} height={48} className="mx-auto" />
            <p className="text-sm font-mono text-zinc-400 animate-pulse">Verifying account...</p>
          </div>
        ) : authUser?.isVerified ? (
          <div className="space-y-8">
            <div className="size-20 mx-auto rounded-none bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <ShieldCheck className="size-10" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Email <span className="text-emerald-500">Verified</span></h1>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
                Your account has been verified. You now have full access to the roadmap and code execution.
              </p>
            </div>
            <div className="pt-4">
              <Link
                to="/roadmap"
                className="group inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-none text-sm font-bold hover:bg-zinc-200 transition-none"
              >
                Enter Workspace
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="size-20 mx-auto rounded-none bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <ShieldAlert className="size-10" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Verification <span className="text-rose-500">Failed</span></h1>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
                Verification could not be completed. The link may have expired or is invalid.
              </p>
            </div>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-8 py-3 rounded-none text-sm font-bold hover:bg-zinc-800 transition-none"
              >
                Log In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
