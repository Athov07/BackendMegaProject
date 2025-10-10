import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
const { name, description, videos = [] } = req.body;

  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "Playlist name and description are required");
  }

  // Validate only valid video IDs
  const validVideos = videos.filter(id => isValidObjectId(id));

  const playlist = await Playlist.create({
    name: name.trim(),
    description: description.trim(),
    videos: validVideos,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});




const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const playlists = await Playlist.find({ owner: userId })
    .populate("videos", "title thumbnail duration")
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "User playlists fetched successfully"));
});




const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const playlist = await Playlist.findById(playlistId)
    .populate("videos", "title thumbnail duration")
    .lean();

  if (!playlist) throw new ApiError(404, "Playlist not found");

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});




const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist or video ID");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  // Use $addToSet to avoid duplicate entries
  await Playlist.findByIdAndUpdate(
    playlistId,
    { $addToSet: { videos: videoId } },
    { new: true }
  );

  const updatedPlaylist = await Playlist.findById(playlistId).populate(
    "videos",
    "title thumbnail duration"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist"));
});




const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist or video ID");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } },
    { new: true }
  );

  const updatedPlaylist = await Playlist.findById(playlistId).populate(
    "videos",
    "title thumbnail duration"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist"));
});




const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this playlist");
  }

  await Playlist.findByIdAndDelete(playlistId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});




const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this playlist");
  }

  if (name) playlist.name = name.trim();
  if (description) playlist.description = description.trim();

  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
