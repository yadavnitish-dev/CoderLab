import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, Code2 } from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import BrutalistButton from "../components/BrutalistButton";
import SocialAuthButtons from "../components/SocialAuthButtons";

const SignUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type SignUpFormData = z.infer<typeof SignUpSchema>;

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigninUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signup(data);
    } catch (error) {
      console.error("SignUp failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand/Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-sm group-hover:border-zinc-500 transition-all duration-300">
              <Code2 className="size-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white uppercase font-display">
              AlgoPrep
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Create your account
          </h1>
          <p className="text-zinc-500 text-sm">
            Join the next generation of algorithm masters
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#0d0d0d] border border-zinc-800 p-8 rounded-sm shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-emerald-500/50 transition-colors" />
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full bg-[#050505] border ${errors.name ? "border-rose-500/50" : "border-zinc-800"} rounded-sm py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700 font-mono`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-emerald-500/50 transition-colors" />
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full bg-[#050505] border ${errors.email ? "border-rose-500/50" : "border-zinc-800"} rounded-sm py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700 font-mono`}
                  placeholder="admin@system.io"
                />
              </div>
              {errors.email && (
                <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-emerald-500/50 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full bg-[#050505] border ${errors.password ? "border-rose-500/50" : "border-zinc-800"} rounded-sm py-2.5 pl-10 pr-10 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700 font-mono`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <BrutalistButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={isSigninUp}
            >
              Create Account
            </BrutalistButton>
          </form>

          <SocialAuthButtons />

          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="text-xs font-bold uppercase tracking-widest text-zinc-700 hover:text-zinc-500 transition-colors"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
