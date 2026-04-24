import { describe, it, expect, vi, beforeEach } from "vitest";
import { playlistService } from "./playlist.service.js";
import { db } from "../libs/db.js";
import { 
  UnauthorizedError, 
  NotFoundError, 
  ValidationError 
} from "./errors.js";

vi.mock("../libs/db.js", () => {
  const mockDb = {
    playlist: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    problem: {
      findMany: vi.fn(),
    },
    problemInPlaylist: {
      createMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(mockDb)),
  };
  return { db: mockDb };
});

describe("PlaylistService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createPlaylist", () => {
    it("should create a playlist for authenticated user", async () => {
      const input = { name: "Study List", description: "DSA Practice" };
      (db.playlist.create as any).mockResolvedValue({ id: "pl-1", ...input, userId: "user-1" });

      const result = await playlistService.createPlaylist("user-1", input);

      expect(result.id).toBe("pl-1");
      expect(db.playlist.create).toHaveBeenCalledWith({
        data: { name: "Study List", description: "DSA Practice", userId: "user-1" },
      });
    });

    it("should throw ValidationError if name is empty", async () => {
      await expect(playlistService.createPlaylist("user-1", { name: "" }))
        .rejects.toThrow(ValidationError);
    });

    it("should throw UnauthorizedError if no userId provided", async () => {
        await expect(playlistService.createPlaylist("", { name: "Test" }))
          .rejects.toThrow(UnauthorizedError);
    });
  });

  describe("getPlaylistById", () => {
    it("should return playlist if user owns it", async () => {
      const mockPlaylist = { id: "pl-1", userId: "user-1", name: "My List" };
      (db.playlist.findFirst as any).mockResolvedValue(mockPlaylist);

      const result = await playlistService.getPlaylistById("pl-1", "user-1");

      expect(result).toEqual(mockPlaylist);
    });

    it("should throw NotFoundError if playlist not found or not owned", async () => {
      (db.playlist.findFirst as any).mockResolvedValue(null);

      await expect(playlistService.getPlaylistById("pl-1", "user-2"))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe("addProblemsToPlaylist", () => {
    const input = { problemIds: ["p-1", "p-2"] };

    it("should add problems if user owns playlist and problems exist", async () => {
      (db.playlist.findFirst as any).mockResolvedValue({ id: "pl-1", userId: "user-1" });
      (db.problem.findMany as any).mockResolvedValue([{ id: "p-1" }, { id: "p-2" }]);
      (db.problemInPlaylist.createMany as any).mockResolvedValue({ count: 2 });

      const result = await playlistService.addProblemsToPlaylist("pl-1", "user-1", input);

      expect(result.count).toBe(2);
      expect(db.problemInPlaylist.createMany).toHaveBeenCalled();
    });

    it("should throw ValidationError if some problems do not exist", async () => {
      (db.playlist.findFirst as any).mockResolvedValue({ id: "pl-1", userId: "user-1" });
      (db.problem.findMany as any).mockResolvedValue([{ id: "p-1" }]); // p-2 missing

      await expect(playlistService.addProblemsToPlaylist("pl-1", "user-1", input))
        .rejects.toThrow(ValidationError);
    });
  });

  describe("getAllPlaylists", () => {
    it("should return all playlists for a user", async () => {
      const mockPlaylists = [{ id: "pl-1", name: "List 1" }, { id: "pl-2", name: "List 2" }];
      (db.playlist.findMany as any).mockResolvedValue(mockPlaylists);

      const result = await playlistService.getAllPlaylists("user-1");

      expect(result).toHaveLength(2);
      expect(db.playlist.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId: "user-1" }
      }));
    });

    it("should throw UnauthorizedError if no userId provided", async () => {
      await expect(playlistService.getAllPlaylists(""))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe("removeProblemFromPlaylist", () => {
    it("should remove problem from playlist successfully", async () => {
      (db.problemInPlaylist.deleteMany as any).mockResolvedValue({ count: 1 });

      await playlistService.removeProblemFromPlaylist("pl-1", "p-1", "user-1");

      expect(db.problemInPlaylist.deleteMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          playListId: "pl-1",
          problemId: "p-1",
          playlist: { userId: "user-1" }
        })
      }));
    });

    it("should throw NotFoundError if playlist entry not found or not owned", async () => {
      (db.problemInPlaylist.deleteMany as any).mockResolvedValue({ count: 0 });
      await expect(playlistService.removeProblemFromPlaylist("pl-1", "p-1", "user-1"))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe("deletePlaylist", () => {
    it("should delete playlist successfully", async () => {
      (db.playlist.deleteMany as any).mockResolvedValue({ count: 1 });

      await playlistService.deletePlaylist("pl-1", "user-1");

      expect(db.playlist.deleteMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "pl-1", userId: "user-1" }
      }));
    });

    it("should throw NotFoundError if playlist not found or not owned", async () => {
      (db.playlist.deleteMany as any).mockResolvedValue({ count: 0 });
      await expect(playlistService.deletePlaylist("pl-1", "user-1"))
        .rejects.toThrow(NotFoundError);
    });
  });
});
