import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePlaylistStore } from "./usePlaylistStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

vi.mock("../lib/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("usePlaylistStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePlaylistStore.setState({
      playlists: [],
      currentPlaylist: null,
      isLoading: false,
      error: null,
    });
  });

  it("should create playlist and update state", async () => {
    const mockPlaylist = { id: "pl-1", name: "DSA" };
    (axiosInstance.post as any).mockResolvedValue({ 
      data: { playlist: mockPlaylist, message: "Created" } 
    });

    await usePlaylistStore.getState().createPlaylist({ name: "DSA" });

    expect(usePlaylistStore.getState().playlists).toContainEqual(mockPlaylist);
    expect(toast.success).toHaveBeenCalledWith("Playlist created");
  });

  it("should delete playlist and remove from state", async () => {
    usePlaylistStore.setState({ playlists: [{ id: "pl-1", name: "DSA" }] as any });
    (axiosInstance.delete as any).mockResolvedValue({});

    await usePlaylistStore.getState().deletePlaylist("pl-1");

    expect(usePlaylistStore.getState().playlists).toHaveLength(0);
    expect(toast.success).toHaveBeenCalledWith("Playlist deleted");
  });

  it("should handle error when creating playlist", async () => {
    const errorResponse = {
      response: { data: { error: "Name taken" } }
    };
    (axiosInstance.post as any).mockRejectedValue(errorResponse);

    try {
        await usePlaylistStore.getState().createPlaylist({ name: "DSA" });
    } catch (e) {
        // expected
    }

    expect(toast.error).toHaveBeenCalledWith("Name taken");
  });
});
