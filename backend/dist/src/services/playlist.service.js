import { db } from "../libs/db.js";
import { UnauthorizedError, NotFoundError, ValidationError } from "./errors.js";
/**
 * Playlist Service
 * Handles playlist creation, updates, and problem management
 */
export class PlaylistService {
    /**
     * Create a new playlist
     */
    async createPlaylist(userId, input) {
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
    async getAllPlaylists(userId) {
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
    async getPlaylistById(playlistId, userId) {
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
    async addProblemsToPlaylist(playlistId, userId, input) {
        if (!userId) {
            throw new UnauthorizedError();
        }
        if (!Array.isArray(input.problemIds) || input.problemIds.length === 0) {
            throw new ValidationError("At least one problem ID is required");
        }
        // Verify user owns the playlist
        const playlist = await db.playlist.findFirst({
            where: {
                id: playlistId,
                userId,
            },
        });
        if (!playlist) {
            throw new NotFoundError("Playlist");
        }
        // Verify all problems exist
        const problems = await db.problem.findMany({
            where: { id: { in: input.problemIds } },
            select: { id: true },
        });
        if (problems.length !== input.problemIds.length) {
            throw new ValidationError("One or more problems do not exist");
        }
        // Add problems to playlist (skip duplicates)
        const problemsInPlaylist = await db.problemInPlaylist.createMany({
            data: input.problemIds.map((problemId) => ({
                playListId: playlistId,
                problemId,
            })),
            skipDuplicates: true,
        });
        return problemsInPlaylist;
    }
    /**
     * Remove a problem from playlist
     */
    async removeProblemFromPlaylist(playlistId, problemId, userId) {
        if (!userId) {
            throw new UnauthorizedError();
        }
        // Verify user owns the playlist
        const playlist = await db.playlist.findFirst({
            where: {
                id: playlistId,
                userId,
            },
        });
        if (!playlist) {
            throw new NotFoundError("Playlist");
        }
        await db.problemInPlaylist.deleteMany({
            where: {
                playListId: playlistId,
                problemId,
            },
        });
    }
    /**
     * Delete a playlist
     */
    async deletePlaylist(playlistId, userId) {
        if (!userId) {
            throw new UnauthorizedError();
        }
        if (!playlistId) {
            throw new ValidationError("Playlist ID is required");
        }
        // Verify user owns the playlist
        const playlist = await db.playlist.findFirst({
            where: {
                id: playlistId,
                userId,
            },
        });
        if (!playlist) {
            throw new NotFoundError("Playlist");
        }
        await db.playlist.delete({
            where: { id: playlistId },
        });
    }
}
// Export singleton instance
export const playlistService = new PlaylistService();
