import { db } from "../libs/db.js";
export const createPlayList = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const userId = req.user.id;
        const playList = await db.playlist.create({
            data: {
                name,
                description,
                userId,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Playlist created successfully",
            playList,
        });
    }
    catch (error) {
        console.error("Error creating playlist:", error);
        return res.status(500).json({ error: "Failed to create playlist" });
    }
};
export const getPlayAllListDetails = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const playLists = await db.playlist.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        problem: true,
                    },
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playLists,
        });
    }
    catch (error) {
        console.error("Error fetching playlist:", error);
        return res.status(500).json({ error: "Failed to fetch playlist" });
    }
};
export const getPlayListDetails = async (req, res) => {
    const { playlistId } = req.params;
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const playList = await db.playlist.findFirst({
            where: { id: playlistId, userId: req.user.id },
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
        if (!playList) {
            return res.status(404).json({ error: "Playlist not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playList,
        });
    }
    catch (error) {
        console.error("Error fetching playlist:", error);
        return res.status(500).json({ error: "Failed to fetch playlist" });
    }
};
export const addProblemToPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;
    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({ error: "Invalid or missing problemIds" });
        }
        console.log(problemIds.map((problemId) => ({
            playlistId,
            problemId,
        })));
        const problemsInPlaylist = await db.problemInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playListId: playlistId,
                problemId,
            })),
        });
        return res.status(201).json({
            success: true,
            message: "Problems added to playlist successfully",
            problemsInPlaylist,
        });
    }
    catch (error) {
        console.error("Error adding problems to playlist:", error?.message || error);
        return res.status(500).json({ error: "Failed to add problems to playlist" });
    }
};
export const deletePlayList = async (req, res) => {
    const { playlistId } = req.params;
    try {
        const deletedPlaylist = await db.playlist.delete({
            where: {
                id: playlistId,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
            deletedPlaylist,
        });
    }
    catch (error) {
        console.error("Error deleting playlist:", error?.message || error);
        return res.status(500).json({ error: "Failed to delete playlist" });
    }
};
export const removeProblemFromPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;
    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({ error: "Invalid or missing problemIds" });
        }
        const deletedProblem = await db.problemInPlaylist.deleteMany({
            where: {
                playListId: playlistId,
                problemId: {
                    in: problemIds,
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: "Problem removed from playlist successfully",
            deletedProblem,
        });
    }
    catch (error) {
        console.error("Error removing problem from playlist:", error?.message || error);
        return res.status(500).json({ error: "Failed to remove problem from playlist" });
    }
};
