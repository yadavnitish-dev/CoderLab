import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { sanitizeInputs } from "../middleware/validation.middleware.js";
import { generalLimiter } from "../middleware/rateLimiter.middleware.js";
import {
  addProblemToPlaylist,
  createPlayList,
  deletePlayList,
  getPlayAllListDetails,
  getPlayListDetails,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getPlayAllListDetails);

router.get("/:playlistId", authMiddleware, getPlayListDetails);

router.post(
  "/create-playlist",
  authMiddleware,
  generalLimiter,
  sanitizeInputs,
  createPlayList,
);

router.post(
  "/:playlistId/add-problem",
  authMiddleware,
  generalLimiter,
  sanitizeInputs,
  addProblemToPlaylist,
);

router.delete("/:playlistId", authMiddleware, generalLimiter, deletePlayList);

router.delete(
  "/:playlistId/remove-problem",
  authMiddleware,
  generalLimiter,
  sanitizeInputs,
  removeProblemFromPlaylist,
);

export default router;
