import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SettingsPage from "./SettingsPage";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// Mock the store
vi.mock("../store/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

// Mock Lucide icons to avoid rendering complexity in tests if needed, 
// but usually jsdom handles them fine.

describe("SettingsPage", () => {
  const mockUpdateProfile = vi.fn();
  const mockUpdatePassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      authUser: {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        isSocial: false,
        socialProvider: null,
      },
      isUpdatingProfile: false,
      updateProfile: mockUpdateProfile,
      updatePassword: mockUpdatePassword,
    });
  });

  it("should render profile info correctly for local users", () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
  });

  it("should show password form when Security tab is active for local users", () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Security"));

    expect(screen.getByText("Current Password")).toBeInTheDocument();
    expect(screen.getByText("New Password")).toBeInTheDocument();
  });

  it("should hide password form and show OAuth message for social users", () => {
    // Override mock for social user
    (useAuthStore as any).mockReturnValue({
      authUser: {
        id: "user-social",
        name: "Google User",
        email: "google@example.com",
        isSocial: true,
        socialProvider: "google",
      },
      isUpdatingProfile: false,
    });

    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Security"));

    expect(screen.queryByText("Current Password")).not.toBeInTheDocument();
    expect(screen.getByText("OAuth Account")).toBeInTheDocument();
    expect(screen.getByText(/your account security is managed by/i)).toBeInTheDocument();
    expect(screen.getByText("google")).toBeInTheDocument();
  });
});
