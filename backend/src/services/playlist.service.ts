import { db } from "../libs/db.js";
import { UnauthorizedError, NotFoundError, ValidationError } from "./errors.js";

export interface CreatePlaylistInput {
  name: string;
  description?: string;
}

export interface AddProblemsToPlaylistInput {
  problemIds: string[];
}

/**
 * Playlist Service
 * Handles playlist creation, updates, and problem management
 */
export class PlaylistService {
  /**
   * Create a new playlist
   */
  async createPlaylist(
    userId: string,
    input: CreatePlaylistInput
  ): Promise<any> {
    if (!userId) {
      throw new UnauthorizedError();
    }

    if (!input.name || input.name.trim().length === 0) {
      throw new ValidationError("Playlist name is required");
    }

    const playlist = await db.playlist.create({
      data: {
        name: input.name,
        description: input.description || null,
        userId,
      },
    });

    return playlist;
  }

  /**
   * Get all playlists for a user
   */
  async getAllPlaylists(userId: string): Promise<any[]> {
    if (!userId) {
      throw new UnauthorizedError();
    }

    const playlists = await db.playlist.findMany({
      where: { userId },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return playlists;
  }

  /**
   * Get a single playlist by ID
   */
  async getPlaylistById(playlistId: string, userId: string): Promise<any> {
    if (!userId) {
      throw new UnauthorizedError();
    }

    if (!playlistId) {
      throw new ValidationError("Playlist ID is required");
    }

    const playlist = await db.playlist.findFirst({
      where: {
        id: playlistId,
        userId, // Ensure user owns the playlist
      },
      include: {
        problems: {
          include: {
            problem: {
              include: {
                solvedBy: {
                  select: {
                    userId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!playlist) {
      throw new NotFoundError("Playlist");
    }

    return playlist;
  }

  /**
   * Add problems to a playlist
   */
  async addProblemsToPlaylist(
    playlistId: string,
    userId: string,
    input: AddProblemsToPlaylistInput
  ): Promise<any> {
    if (!userId) {
      throw new UnauthorizedError();
    }

    if (!Array.isArray(input.problemIds) || input.problemIds.length === 0) {
      throw new ValidationError("At least one problem ID is required");
    }

    return await db.$transaction(async (tx) => {
      // Verify user owns the playlist
      const playlist = await tx.playlist.findFirst({
        where: {
          id: playlistId,
          userId,
        },
      });

      if (!playlist) {
        throw new NotFoundError("Playlist");
      }

      // Verify all problems exist
      const problems = await tx.problem.findMany({
        where: { id: { in: input.problemIds } },
        select: { id: true },
      });

      if (problems.length !== input.problemIds.length) {
        throw new ValidationError("One or more problems do not exist");
      }

      // Add problems to playlist (skip duplicates)
      const problemsInPlaylist = await tx.problemInPlaylist.createMany({
        data: input.problemIds.map((problemId) => ({
          playListId: playlistId,
          problemId,
        })),
        skipDuplicates: true,
      });

      return problemsInPlaylist;
    });
  }

  /**
   * Remove a problem from playlist
   */
  async removeProblemFromPlaylist(
    playlistId: string,
    problemId: string,
    userId: string
  ): Promise<void> {
    if (!userId) {
      throw new UnauthorizedError();
    }

    // Combined ownership check and deletion
    const result = await db.problemInPlaylist.deleteMany({
      where: {
        playListId: playlistId,
        problemId,
        playlist: {
          userId,
        },
      },
    });

    if (result.count === 0) {
      throw new NotFoundError("Playlist entry");
    }
  }

  /**
   * Delete a playlist
   */
  async deletePlaylist(playlistId: string, userId: string): Promise<void> {
    if (!userId) {
      throw new UnauthorizedError();
    }

    if (!playlistId) {
      throw new ValidationError("Playlist ID is required");
    }

    // Combined ownership check and deletion
    const result = await db.playlist.deleteMany({
      where: {
        id: playlistId,
        userId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundError("Playlist");
    }
  }
}

// Export singleton instance
export const playlistService = new PlaylistService();
