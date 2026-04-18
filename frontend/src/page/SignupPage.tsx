import { useState } from "react";
import leetLabLogo from "../assets/leetlab.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  ArrowRight
} from "lucide-react";
import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const SignUpSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
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
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[40%] w-[30%] h-[30%] bg-secondary/20 blur-[100px] rounded-full -z-10 opacity-30 pointer-events-none"></div>

      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl border border-white/5 shadow-2xl shadow-black/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-primary/20 shadow-lg shadow-primary/5">
                <img src={leetLabLogo} className="size-8" alt="Logo" />
              </div>
              <h1 className="text-3xl font-bold mt-4 font-display tracking-tight text-white flex items-center gap-2">
                AlgoPrep
              </h1>
              <p className="text-base-content/60 text-sm font-medium">Create your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="form-control">
              <label className="label pl-1">
                <span className="label-text font-medium text-base-content/70">Full Name</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  {...register("name")}
                  className={`input input-bordered w-full pl-10 bg-base-300/30 border-white/10 focus:border-primary/50 focus:bg-base-300/50 transition-all ${
                    errors.name ? "input-error" : ""
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-error text-xs mt-1.5 ml-1 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label pl-1">
                <span className="label-text font-medium text-base-content/70">Email Address</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`input input-bordered w-full pl-10 bg-base-300/30 border-white/10 focus:border-primary/50 focus:bg-base-300/50 transition-all ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-error text-xs mt-1.5 ml-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label pl-1">
                <span className="label-text font-medium text-base-content/70">Password</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`input input-bordered w-full pl-10 bg-base-300/30 border-white/10 focus:border-primary/50 focus:bg-base-300/50 transition-all ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-1.5 ml-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-200 mt-2"
              disabled={isSigninUp}
            >
              {isSigninUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-base-content/60 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary font-semibold hover:no-underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <div className="hidden lg:block relative overflow-hidden bg-base-300/30">
          <AuthImagePattern
            title={"Master The Algorithms"}
            subtitle={
              "Join our platform to access premium coding problems and track your progress."
            }
          />
      </div>
    </div>
  );
};

export default SignUpPage;