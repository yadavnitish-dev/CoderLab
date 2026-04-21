import { FC, useState } from "react";
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
  AlertTriangle
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import BrutalistButton from "../components/BrutalistButton";

const ProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
});

const PasswordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof ProfileSchema>;
type PasswordFormData = z.infer<typeof PasswordSchema>;

const SettingsPage: FC = () => {
  const { authUser, updateProfile, updatePassword, isUpdatingProfile, deleteAccount } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "danger">("profile");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: authUser?.name || "",
    },
  });

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
    } catch (error) {
      setIsDeleting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Subtle Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="workspace-container relative z-10 pt-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-sm">
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
                  : "bg-black border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              }`}
            >
              <UserIcon className="size-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 border transition-all text-sm font-bold uppercase tracking-widest ${
                activeTab === "security"
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-black border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
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
                  : "bg-black border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-rose-400"
              }`}
            >
              <Trash2 className="size-4" />
              Danger Zone
            </button>
          </div>

          {/* Main Form Content */}
          <div className="lg:col-span-3">
            <div className="bg-black border border-zinc-800 p-8 rounded-sm shadow-2xl">
              {activeTab === "profile" ? (
                <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-8 animate-in fade-in duration-500">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">
                        Display Name
                      </label>
                      <div className="relative group">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-emerald-500/50 transition-colors" />
                        <input
                          {...registerProfile("name")}
                          className={`w-full bg-[#050505] border ${profileErrors.name ? "border-rose-500/50" : "border-zinc-800"} rounded-sm py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all font-mono`}
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
              ) : activeTab === "security" ? (
                <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-8 animate-in fade-in duration-500">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">
                        Current Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-emerald-500/50 transition-colors" />
                        <input
                          type="password"
                          {...registerPassword("oldPassword")}
                          className={`w-full bg-[#050505] border ${passwordErrors.oldPassword ? "border-rose-500/50" : "border-zinc-800"} rounded-sm py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all font-mono`}
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
                        <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">
                          New Password
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-emerald-500/50 transition-colors" />
                          <input
                            type="password"
                            {...registerPassword("newPassword")}
                            className={`w-full bg-[#050505] border ${passwordErrors.newPassword ? "border-rose-500/50" : "border-zinc-800"} rounded-sm py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all font-mono`}
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
                        <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">
                          Confirm Password
                        </label>
                        <div className="relative group">
                          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-emerald-500/50 transition-colors" />
                          <input
                            type="password"
                            {...registerPassword("confirmPassword")}
                            className={`w-full bg-[#050505] border ${passwordErrors.confirmPassword ? "border-rose-500/50" : "border-zinc-800"} rounded-sm py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all font-mono`}
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
              ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="p-6 border border-rose-900/50 bg-rose-950/10 rounded-sm space-y-4">
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
                        variant="primary"
                        onClick={() => setShowConfirmModal(true)}
                        className="bg-rose-600 hover:bg-rose-500 border-rose-700 text-white"
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
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-rose-950/30 p-3 rounded-full">
                <AlertTriangle className="size-6 text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Confirm Deletion</h2>
            </div>
            
            <p className="text-zinc-400 text-sm mb-8 font-mono leading-relaxed">
              Are you absolutely certain? This is the point of no return. Your data will be wiped from our nodes permanently.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                disabled={isDeleting}
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-3 border border-zinc-800 text-zinc-400 text-sm font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all disabled:opacity-50"
              >
                Abort
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="flex-1 px-6 py-3 bg-rose-600 border border-rose-700 text-white text-sm font-bold uppercase tracking-widest hover:bg-rose-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
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
