import { playlistService, AppError } from "../services/index.js";
import { validateInput } from "../services/validation.helper.js";
import { createPlaylistSchema, addProblemsSchema, removeProblemSchema, } from "../middleware/validation.schema.js";
import { z } from "zod";
/**
 * Create a new playlist
 */
export const createPlayList = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const validatedData = validateInput(req.body, createPlaylistSchema);
        const playlist = await playlistService.createPlaylist(req.user.id, validatedData);
        res.status(201).json({
            success: true,
            message: "Playlist created successfully",
            playlist,
        });
    }
    catch (error) {
        handlePlaylistError(error, res);
    }
};
/**
 * Get all playlists for the authenticated user
 */
export const getPlayAllListDetails = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const playlists = await playlistService.getAllPlaylists(req.user.id);
        res.status(200).json({
            success: true,
            message: "Playlists fetched successfully",
            playlists,
        });
    }
    catch (error) {
        handlePlaylistError(error, res);
    }
};
/**
 * Get a single playlist by ID
 */
export const getPlayListDetails = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { playlistId } = validateInput(req.params, z.object({ playlistId: z.string().uuid("Invalid playlist ID format") }));
        const playlist = await playlistService.getPlaylistById(playlistId, req.user.id);
        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlist,
        });
    }
    catch (error) {
        handlePlaylistError(error, res);
    }
};
/**
 * Add problems to a playlist
 */
export const addProblemToPlaylist = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { playlistId } = validateInput(req.params, z.object({ playlistId: z.string().uuid("Invalid playlist ID format") }));
        const validatedData = validateInput(req.body, addProblemsSchema);
        const result = await playlistService.addProblemsToPlaylist(playlistId, req.user.id, validatedData);
        res.status(201).json({
            success: true,
            message: "Problems added to playlist successfully",
            result,
        });
    }
    catch (error) {
        handlePlaylistError(error, res);
    }
};
/**
 * Delete a playlist
 */
export const deletePlayList = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { playlistId } = validateInput(req.params, z.object({ playlistId: z.string().uuid("Invalid playlist ID format") }));
        await playlistService.deletePlaylist(playlistId, req.user.id);
        res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
        });
    }
    catch (error) {
        handlePlaylistError(error, res);
    }
};
/**
 * Remove problem from playlist
 */
export const removeProblemFromPlaylist = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { playlistId } = validateInput(req.params, z.object({ playlistId: z.string().uuid("Invalid playlist ID format") }));
        const { problemIds } = validateInput(req.body, removeProblemSchema);
        for (const problemId of problemIds) {
            await playlistService.removeProblemFromPlaylist(playlistId, problemId, req.user.id);
        }
        res.status(200).json({
            success: true,
            message: "Problem removed from playlist successfully",
        });
    }
    catch (error) {
        handlePlaylistError(error, res);
    }
};
/**
 * Centralized error handler for playlist controller
 */
function handlePlaylistError(error, res) {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            error: error.message,
            code: error.code,
        });
        return;
    }
    console.error("Unexpected error in playlist controller:", error);
    res.status(500).json({
        error: "Internal server error",
    });
}
