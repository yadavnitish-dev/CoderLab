import { useForm } from "react-hook-form";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Reset Password Page
 * Form to define and commit new security credentials.
 */
const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { resetPassword, isLoggingIn } = useAuthStore();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("password");

  const onSubmit = async (data: any) => {
    if (!token) return;
    try {
      await resetPassword({ token, password: data.password });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Invalid Link</h1>
          <p className="text-zinc-500 text-sm">Security token is required to reset password.</p>
          <Link to="/login" className="inline-flex items-center gap-2 text-white bg-zinc-900 border border-zinc-800 px-6 py-2.5 rounded-sm text-xs font-bold hover:bg-zinc-800 transition-all">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="text-center space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-6">
            AlgoPrep // Reset Password
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Update <span className="text-emerald-500">Password</span></h1>
          <p className="text-zinc-500 text-sm">Set a new password for your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="form-control">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2 block">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-white transition-colors">
                  <Lock className="size-4" />
                </div>
                <input
                  type="password"
                  className="w-full bg-black border border-zinc-800 rounded-sm pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="••••••••"
                  {...register("password", { 
                    required: "Password required",
                    minLength: { value: 6, message: "Min 6 characters" },
                    pattern: { value: /(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/, message: "Must include Uppercase + Number + Special Char"}
                  })}
                />
              </div>
              {errors.password && (
                <span className="text-[10px] font-bold text-rose-500 mt-2 uppercase tracking-wide">{(errors.password as any).message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2 block">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-white transition-colors">
                  <ShieldCheck className="size-4" />
                </div>
                <input
                  type="password"
                  className="w-full bg-black border border-zinc-800 rounded-sm pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="••••••••"
                  {...register("confirmPassword", { 
                    required: "Confirmation required",
                    validate: value => value === password || "Passwords do not match"
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-[10px] font-bold text-rose-500 mt-2 uppercase tracking-wide">{(errors.confirmPassword as any).message}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-white text-black py-3 rounded-sm text-sm font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-white/5 disabled:opacity-50"
          >
            {isLoggingIn ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShieldCheck className="size-4 group-hover:scale-110 transition-transform" />
            )}
            Set New Password
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
