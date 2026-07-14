import { FC, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  User as UserIcon, 
  Lock, 
  Settings as SettingsIcon, 
  Shield,
  Save,
  Loader2,
  Trash2,
  AlertTriangle,
  Mail,
  Palette
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import BrutalistButton from "../components/BrutalistButton";
import Skeleton from "../components/Skeleton";
import { useTheme, THEMES, Theme } from "../hooks/useTheme";

const ProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
});

const PasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof ProfileSchema>;
type PasswordFormData = z.infer<typeof PasswordSchema>;

const SettingsPage: FC = () => {
  const { authUser, updateProfile, updatePassword, isUpdatingProfile, deleteAccount } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "security" | "danger">("profile");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: authUser?.name || "",
    },
  });

  // Sync form with authUser when it loads to avoid controlled/uncontrolled warnings
  useEffect(() => {
    if (authUser) {
      resetProfile({
        name: authUser.name || "",
      });
    }
  }, [authUser, resetProfile]);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    await updateProfile(data);
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    await updatePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
    resetPassword();
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch {
      setIsDeleting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      <div className="workspace-container relative z-10 pt-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-none">
            <SettingsIcon className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 border transition-all text-sm font-bold uppercase tracking-widest ${
                activeTab === "profile"
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-black border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
              }`}
            >
              <UserIcon className="size-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`w-full flex items-center gap-3 px-4 py-3 border transition-all text-sm font-bold uppercase tracking-widest ${
                activeTab === "appearance"
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-black border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
              }`}
            >
              <Palette className="size-4" />
              Appearance
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 border transition-all text-sm font-bold uppercase tracking-widest ${
                activeTab === "security"
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-black border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
              }`}
            >
              <Shield className="size-4" />
              Security
            </button>
            <button
              onClick={() => setActiveTab("danger")}
              className={`w-full flex items-center gap-3 px-4 py-3 border transition-all text-sm font-bold uppercase tracking-widest ${
                activeTab === "danger"
                  ? "bg-zinc-900 border-zinc-700 text-rose-500"
                  : "bg-black border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-rose-400"
              }`}
            >
              <Trash2 className="size-4" />
              Danger Zone
            </button>
          </div>

          {/* Main Form Content */}
          <div className="lg:col-span-3">
            <div className="bg-black border border-zinc-800 p-8 rounded-none">
              {activeTab === "profile" ? (
                <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                        Email Address
                      </label>
                      <div className="relative group opacity-50">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                        <input
                          readOnly
                          value={authUser?.email || ""}
                          className="w-full bg-[#050505] border border-zinc-900 rounded-none py-3 pl-10 pr-4 text-sm text-zinc-400 font-mono cursor-not-allowed"
                        />
                      </div>
                      <p className="text-[9px] text-zinc-500 font-mono ml-1 italic">
                        Email cannot be changed. Contact support for account migration.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                        Display Name
                      </label>
                      <div className="relative group">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-emerald-500/50 transition-colors" />
                        <input
                          {...registerProfile("name")}
                          className={`w-full bg-[#050505] border ${profileErrors.name ? "border-rose-500/50" : "border-zinc-800"} rounded-none py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-none font-mono`}
                          placeholder="Your name"
                        />
                      </div>
                      {profileErrors.name && (
                        <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">
                          {profileErrors.name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-900 flex justify-end">
                    <BrutalistButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      icon={isUpdatingProfile ? Loader2 : Save}
                      disabled={isUpdatingProfile}
                      className={isUpdatingProfile ? "animate-pulse" : ""}
                    >
                      Update Profile
                    </BrutalistButton>
                  </div>
                </form>
              ) : activeTab === "appearance" ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {THEMES.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => setTheme(t.value as Theme)}
                          className={`p-4 border text-left transition-all group ${
                            theme === t.value
                              ? "border-emerald-500 bg-emerald-500/5"
                              : "border-zinc-800 hover:border-zinc-700 bg-[#050505]"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div 
                              className="w-4 h-4 border"
                              style={{ 
                                backgroundColor: 
                                  t.value === 'industrial' ? '#10b981' : 
                                  t.value === 'amber' ? '#f59e0b' : 
                                  t.value === 'mono' ? '#ffffff' : 
                                  t.value === 'cool' ? '#6366f1' : 
                                  t.value === 'muted' ? '#6b7280' :
                                  t.value === 'crimson' ? '#dc2626' :
                                  t.value === 'teal' ? '#14b8a6' :
                                  t.value === 'orange' ? '#ea580c' :
                                  t.value === 'forest' ? '#22c55e' :
                                  '#94a3b8'
                              }} 
                            />
                            <span className="text-sm font-bold text-white uppercase tracking-widest">
                              {t.label}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500 font-mono">{t.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeTab === "security" ? (
                authUser?.isSocial ? (
                  <div className="space-y-8">
                    <div className="p-12 border border-zinc-900 bg-[#050505] rounded-none text-center space-y-6">
                      <div className="bg-zinc-900/50 size-16 mx-auto rounded-none flex items-center justify-center">
                        <Shield className="size-8 text-emerald-500/50" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm">OAuth Account</h3>
                        <p className="text-zinc-400 text-xs font-mono max-w-sm mx-auto leading-relaxed">
                          Your account security is managed by <span className="text-emerald-500 uppercase">{authUser.socialProvider || "your social provider"}</span>. 
                          Password updates are not available for social logins.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                          Current Password
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-emerald-500/50 transition-colors" />
                          <input
                            type="password"
                            {...registerPassword("oldPassword")}
                            className={`w-full bg-[#050505] border ${passwordErrors.oldPassword ? "border-rose-500/50" : "border-zinc-800"} rounded-none py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-none font-mono`}
                            placeholder="••••••••"
                          />
                        </div>
                        {passwordErrors.oldPassword && (
                          <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">
                            {passwordErrors.oldPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                            New Password
                          </label>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-emerald-500/50 transition-colors" />
                            <input
                              type="password"
                              {...registerPassword("newPassword")}
                              className={`w-full bg-[#050505] border ${passwordErrors.newPassword ? "border-rose-500/50" : "border-zinc-800"} rounded-none py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-none font-mono`}
                              placeholder="••••••••"
                            />
                          </div>
                          {passwordErrors.newPassword && (
                            <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">
                              {passwordErrors.newPassword.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                            Confirm Password
                          </label>
                          <div className="relative group">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-emerald-500/50 transition-colors" />
                            <input
                              type="password"
                              {...registerPassword("confirmPassword")}
                              className={`w-full bg-[#050505] border ${passwordErrors.confirmPassword ? "border-rose-500/50" : "border-zinc-800"} rounded-none py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-none font-mono`}
                              placeholder="••••••••"
                            />
                          </div>
                          {passwordErrors.confirmPassword && (
                            <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">
                              {passwordErrors.confirmPassword.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 flex justify-end">
                      <BrutalistButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        icon={isUpdatingProfile ? Loader2 : Save}
                        disabled={isUpdatingProfile}
                        className={isUpdatingProfile ? "animate-pulse" : ""}
                      >
                        Update Password
                      </BrutalistButton>
                    </div>
                  </form>
                )
              ) : (
                <div className="space-y-8">
                  <div className="p-6 border border-rose-900/50 bg-rose-950/10 rounded-none space-y-4">
                    <div className="flex items-center gap-3 text-rose-500">
                      <AlertTriangle className="size-5" />
                      <h3 className="font-bold uppercase tracking-widest text-sm">Delete Account</h3>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed font-mono">
                      Proceeding with this action will permanently delete your account and all associated data. 
                      All solve records, code submissions, and playlists will be irreversibly removed. 
                      This operation cannot be undone.
                    </p>
                    <div className="pt-4">
                      <BrutalistButton
                        variant="danger"
                        onClick={() => setShowConfirmModal(true)}
                        icon={Trash2}
                      >
                        Delete Account
                      </BrutalistButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isDeleting && setShowConfirmModal(false)}></div>
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 shadow-none transition-none">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-rose-950/30 p-3 rounded-none">
                <AlertTriangle className="size-6 text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Confirm Deletion</h2>
            </div>
            
            <p className="text-zinc-400 text-sm mb-8 font-mono leading-relaxed">
              Are you absolutely certain? This operation cannot be reversed. Your data will be permanently removed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                disabled={isDeleting}
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-3 border border-zinc-800 text-zinc-400 text-sm font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-none disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="flex-1 px-6 py-3 bg-rose-600 border border-rose-700 text-white text-sm font-bold uppercase tracking-widest hover:bg-rose-500 transition-none disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Skeleton width={16} height={16} className="inline-block" />
                    Deleting...
                  </>
                ) : (
                  "Confirm Deletion"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
