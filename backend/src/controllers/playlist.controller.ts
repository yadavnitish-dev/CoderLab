import { Response } from "express";
import { playlistService, AppError } from "../services/index.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { validateInput } from "../services/validation.helper.js";
import {
  createPlaylistSchema,
  addProblemsSchema,
  removeProblemSchema,
  CreatePlaylistInput,
  AddProblemsInput,
  RemoveProblemInput,
} from "../middleware/validation.schema.js";
import { z } from "zod";

/**
 * Create a new playlist
 */
export const createPlayList = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const validatedData = validateInput<CreatePlaylistInput>(
      req.body,
      createPlaylistSchema,
    );
    const playlist = await playlistService.createPlaylist(
      req.user.id,
      validatedData,
    );

    res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    handlePlaylistError(error, res);
  }
};

/**
 * Get all playlists for the authenticated user
 */
export const getPlayAllListDetails = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
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
  } catch (error) {
    handlePlaylistError(error, res);
  }
};

/**
 * Get a single playlist by ID
 */
export const getPlayListDetails = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { playlistId } = validateInput<{ playlistId: string }>(
      req.params,
      z.object({ playlistId: z.string().uuid("Invalid playlist ID format") }),
    );

    const playlist = await playlistService.getPlaylistById(
      playlistId,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      playlist,
    });
  } catch (error) {
    handlePlaylistError(error, res);
  }
};

/**
 * Add problems to a playlist
 */
export const addProblemToPlaylist = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { playlistId } = validateInput<{ playlistId: string }>(
      req.params,
      z.object({ playlistId: z.string().uuid("Invalid playlist ID format") }),
    );

    const validatedData = validateInput<AddProblemsInput>(
      req.body,
      addProblemsSchema,
    );

    const result = await playlistService.addProblemsToPlaylist(
      playlistId,
      req.user.id,
      validatedData,
    );

    res.status(201).json({
      success: true,
      message: "Problem added to playlist",
      result,
    });
  } catch (error) {
    handlePlaylistError(error, res);
  }
};

/**
 * Delete a playlist
 */
export const deletePlayList = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { playlistId } = validateInput<{ playlistId: string }>(
      req.params,
      z.object({ playlistId: z.string().uuid("Invalid playlist ID format") }),
    );

    await playlistService.deletePlaylist(playlistId, req.user.id);

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    handlePlaylistError(error, res);
  }
};

/**
 * Remove problem from playlist
 */
export const removeProblemFromPlaylist = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { playlistId } = validateInput<{ playlistId: string }>(
      req.params,
      z.object({ playlistId: z.string().uuid("Invalid playlist ID format") }),
    );

    const { problemIds } = validateInput<RemoveProblemInput>(
      req.body,
      removeProblemSchema,
    );

    for (const problemId of problemIds) {
      await playlistService.removeProblemFromPlaylist(
        playlistId,
        problemId,
        req.user.id,
      );
    }

    res.status(200).json({
      success: true,
      message: "Problem removed from playlist",
    });
  } catch (error) {
    handlePlaylistError(error, res);
  }
};

/**
 * Centralized error handler for playlist controller
 */
function handlePlaylistError(error: any, res: Response): void {
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
