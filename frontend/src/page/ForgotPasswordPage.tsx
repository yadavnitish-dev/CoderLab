import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Forgot Password Page
 * High-density form to initiate the recovery protocol.
 */
const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();
  const { forgotPassword, isLoggingIn } = useAuthStore();

  const onSubmit = async (data: { email: string }) => {
    await forgotPassword(data.email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-6">
            AlgoPrep // Access Recovery
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Initialize <span className="text-rose-500">Recovery</span></h1>
          <p className="text-zinc-500 text-sm">
            Enter your terminal address to receive a one-time security link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="form-control">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2 block">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-white transition-colors">
                  <Mail className="size-4" />
                </div>
                <input
                  type="email"
                  className="w-full bg-black border border-zinc-800 rounded-sm pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all placeholder:text-zinc-800"
                  placeholder="name@example.com"
                  {...register("email", { required: "Email address required" })}
                />
              </div>
              {errors.email && (
                <span className="text-[10px] font-bold text-rose-500 mt-2 uppercase tracking-wide">
                  {errors.email.message}
                </span>
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
              <Send className="size-4 group-hover:translate-x-0.5 transition-transform" />
            )}
            Send Recovery Link
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-3" />
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
