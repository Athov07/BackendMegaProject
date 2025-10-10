import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
const userId = req.user._id;

  // Total videos uploaded by user
  const totalVideos = await Video.countDocuments({ owner: userId });

  // Total subscribers for the user (channel)
  const totalSubscribers = await Subscription.countDocuments({ channel: userId });

  // Total likes across all user's videos
  const userVideos = await Video.find({ owner: userId }).select("_id");
  const videoIds = userVideos.map((v) => v._id);

  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalSubscribers,
        totalLikes,
      },
      "Channel stats fetched successfully"
    )
  );
});




const getChannelVideos = asyncHandler(async (req, res) => {
const userId = req.user._id;

  const videos = await Video.find({ owner: userId }).select(
    "title description thumbnail duration createdAt"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      videos,
      "Channel videos fetched successfully"
    )
  );
});




export {
    getChannelStats, 
    getChannelVideos
    }