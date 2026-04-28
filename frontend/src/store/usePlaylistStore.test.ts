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

  describe("createPlaylist", () => {
    it("should create playlist and update state", async () => {
      const mockPlaylist = { id: "pl-1", name: "DSA" };
      (axiosInstance.post as any).mockResolvedValue({ 
        data: { playlist: mockPlaylist, message: "Created" } 
      });

      const result = await usePlaylistStore.getState().createPlaylist({ name: "DSA" });

      expect(usePlaylistStore.getState().playlists).toContainEqual(mockPlaylist);
      expect(usePlaylistStore.getState().isLoading).toBe(false);
      expect(result).toEqual(mockPlaylist);
      expect(toast.success).toHaveBeenCalledWith("Playlist created");
    });

    it("should handle error when creating playlist", async () => {
      const errorResponse = {
        response: { data: { error: "Name taken" } }
      };
      (axiosInstance.post as any).mockRejectedValue(errorResponse);

      await expect(usePlaylistStore.getState().createPlaylist({ name: "DSA" }))
        .rejects.toThrow();

      expect(usePlaylistStore.getState().isLoading).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Name taken");
    });
  });

  describe("getAllPlaylists", () => {
    it("should fetch all playlists and update state", async () => {
      const mockPlaylists = [{ id: "pl-1", name: "DSA" }];
      (axiosInstance.get as any).mockResolvedValue({ 
        data: { playlists: mockPlaylists } 
      });

      await usePlaylistStore.getState().getAllPlaylists();

      expect(usePlaylistStore.getState().playlists).toEqual(mockPlaylists);
      expect(usePlaylistStore.getState().isLoading).toBe(false);
    });
  });

  describe("getPlaylistDetails", () => {
    it("should fetch playlist details and set currentPlaylist", async () => {
      const mockPlaylist = { id: "pl-1", name: "DSA", problems: [] };
      (axiosInstance.get as any).mockResolvedValue({ 
        data: { playlist: mockPlaylist } 
      });

      await usePlaylistStore.getState().getPlaylistDetails("pl-1");

      expect(usePlaylistStore.getState().currentPlaylist).toEqual(mockPlaylist);
      expect(usePlaylistStore.getState().isLoading).toBe(false);
    });
  });

  describe("deletePlaylist", () => {
    it("should delete playlist and remove from state", async () => {
      usePlaylistStore.setState({ 
        playlists: [{ id: "pl-1", name: "DSA" }] as any,
        currentPlaylist: { id: "pl-1", name: "DSA" } as any
      });
      (axiosInstance.delete as any).mockResolvedValue({});

      await usePlaylistStore.getState().deletePlaylist("pl-1");

      expect(usePlaylistStore.getState().playlists).toHaveLength(0);
      expect(usePlaylistStore.getState().currentPlaylist).toBeNull();
      expect(toast.success).toHaveBeenCalledWith("Playlist deleted");
    });
  });

  describe("problem management", () => {
    it("should add problems to playlist and refresh details", async () => {
      const playlistId = "pl-1";
      const problemIds = ["prob-1", "prob-2"];
      
      usePlaylistStore.setState({ 
        currentPlaylist: { id: playlistId, name: "DSA" } as any 
      });
      
      (axiosInstance.post as any).mockResolvedValue({});
      // Mock the subsequent getPlaylistDetails call
      (axiosInstance.get as any).mockResolvedValue({ 
        data: { playlist: { id: playlistId, name: "DSA", description: "Updated via Add" } } 
      });

      await usePlaylistStore.getState().addProblemToPlaylist(playlistId, problemIds);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `/playlist/${playlistId}/add-problem`, 
        { problemIds }
      );
      expect(usePlaylistStore.getState().currentPlaylist?.description).toBe("Updated via Add");
      expect(toast.success).toHaveBeenCalledWith("Problem added to playlist");
    });

    it("should remove problems from playlist and refresh details", async () => {
      const playlistId = "pl-1";
      const problemIds = ["prob-1"];
      
      usePlaylistStore.setState({ 
        currentPlaylist: { id: playlistId, name: "DSA" } as any 
      });
      
      (axiosInstance.delete as any).mockResolvedValue({});
      (axiosInstance.get as any).mockResolvedValue({ 
        data: { playlist: { id: playlistId, name: "DSA", description: "Updated via Remove" } } 
      });

      await usePlaylistStore.getState().removeProblemFromPlaylist(playlistId, problemIds);

      expect(axiosInstance.delete).toHaveBeenCalledWith(
        `/playlist/${playlistId}/remove-problem`, 
        { data: { problemIds } }
      );
      expect(usePlaylistStore.getState().currentPlaylist?.description).toBe("Updated via Remove");
      expect(toast.success).toHaveBeenCalledWith("Problem removed from playlist");
    });
  });
});
