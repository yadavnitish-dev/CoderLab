import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

// Mock dependencies
vi.mock("../lib/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useAuthStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Zustand state manually if needed
    useAuthStore.setState({ 
        authUser: null, 
        isSigninUp: false, 
        isLoggingIn: false, 
        isCheckingAuth: false, 
        isUpdatingProfile: false 
    });
  });

  it("should check auth successfully and set authUser", async () => {
    const mockUser = { id: "user-1", email: "test@example.com" };
    (axiosInstance.get as any).mockResolvedValue({ data: { user: mockUser } });

    await useAuthStore.getState().checkAuth();

    expect(useAuthStore.getState().authUser).toEqual(mockUser);
    expect(useAuthStore.getState().isCheckingAuth).toBe(false);
  });

  it("should set authUser to null on checkAuth failure", async () => {
    (axiosInstance.get as any).mockRejectedValue(new Error("Unauthorized"));

    await useAuthStore.getState().checkAuth();

    expect(useAuthStore.getState().authUser).toBeNull();
  });

  it("should login successfully and show success toast", async () => {
    const mockUser = { id: "user-1", email: "test@example.com" };
    const loginData = { email: "test@example.com", password: "password" };
    (axiosInstance.post as any).mockResolvedValue({ 
      data: { user: mockUser, message: "Logged in" } 
    });

    await useAuthStore.getState().login(loginData);

    expect(useAuthStore.getState().authUser).toEqual(mockUser);
    expect(toast.success).toHaveBeenCalledWith("Logged in");
  });

  it("should logout and clear authUser", async () => {
    useAuthStore.setState({ authUser: { id: "user-1" } as any });
    (axiosInstance.post as any).mockResolvedValue({ data: { message: "Logged out" } });

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().authUser).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("Logged out");
  });

  it("should handle login error and show error toast", async () => {
    const errorResponse = {
      response: {
        data: { error: "Invalid credentials" }
      }
    };
    (axiosInstance.post as any).mockRejectedValue(errorResponse);

    await useAuthStore.getState().login({ email: "bad", password: "bad" });

    expect(useAuthStore.getState().authUser).toBeNull();
    expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
  });
});
