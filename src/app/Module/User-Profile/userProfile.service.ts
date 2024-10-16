/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { UserModel } from "../User/User.model";
import { TUserProfile } from "./userProfile.interface";
import { USER_ROLE, USER_STATUS } from "../User/User.const";
import UserProfileModel from "./userProfile.model";
import PostModel from "../Post/post.mode";
import PaymentInfoModel from "../Payment/payment.model";

const updateUserProfileDB = async (
  payload: Partial<TUserProfile>,
  userId: string
) => {
  const user = await UserModel.findById(userId).select("+password");
  // Find user profile by the userId field in the UserProfileModel
  const userProfile = await UserProfileModel.findOne({ userId }).select("_id");

  if (!userProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "User Profile Data Not Found !");
  }
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found !");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Delete !");
  }

  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  }

  if (payload?.profilePhoto) {
    await UserModel.findByIdAndUpdate(
      { _id: userId },
      {
        profilePhoto: payload?.profilePhoto,
      }
    );
  }

  const result = await UserProfileModel.findOneAndUpdate(
    { userId },
    {
      $set: {
        ...payload,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  if (!result) {
    throw new AppError(
      httpStatus.EXPECTATION_FAILED,
      "User Profile Update Failed"
    );
  }
  return result;
};

const createAndRemoveFollowingDB = async (
  userId: string,
  followersId: string,
  payload: Partial<TUserProfile>
) => {
  const user = await UserModel.findById(userId).select("+password");
  // Find user profile by the userId field in the UserProfileModel
  const userProfile = await UserProfileModel.findOne({
    userId: followersId,
  }).select("_id");

  if (!userProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "User Profile Data Not Found !");
  }
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found !");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Delete !");
  }

  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  }

  if (payload?.isCreateFollowing === true) {
    const result = await UserProfileModel.findOneAndUpdate(
      {
        userId: followersId,
        followers: { $ne: user?._id },
      },
      {
        $addToSet: { followers: user?._id },
      },
      {
        new: true,
      }
    ).select("followers");
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "Your Are Already Following");
    }
    return result;
  }
  if (payload?.isCreateFollowing === false) {
    const result = await UserProfileModel.findOneAndUpdate(
      {
        userId: followersId,
      },
      {
        $pull: { followers: user?._id },
      },
      {
        new: true,
      }
    ).select("followers");
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "Please Follow Fast");
    }
    return result;
  }
};

const findMyProfileDB = async (userId: string) => {
  const user = await UserModel.findById(userId).select("+password");
  // Find user profile by the userId field in the UserProfileModel
  const userProfile = await UserProfileModel.findOne({
    userId,
  })
    .populate({
      path: "userId",
      select: "+password",
    })
    .populate({
      path: "followers",
      select: "_id name profilePhoto isVerified",
    });

  if (!userProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "User Profile Data Not Found !");
  }
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found !");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Delete !");
  }

  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  }

  return userProfile;
};

const myAnalyticsDB = async (userId: string) => {
  // Step 1: Check if the user exists and is active
  const user = await UserModel.findById(userId).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found!");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Deleted!");
  }
  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  }

  // Step 2: Fetch analytics for the user's posts
  const result = await PostModel.aggregate([
    {
      // Match posts by user and exclude deleted ones
      $match: {
        userId: user._id, // Match posts by the specific user
        isDelete: { $ne: true },
      },
    },
    {
      // Group data to get total counts for that user
      $group: {
        _id: null,
        totalReaders: { $sum: 1 }, // Assuming each post represents a reader
        totalReactions: { $sum: { $size: "$react" } },
        totalComments: { $sum: { $size: "$comments" } },
        totalShares: { $sum: "$shareCount" }, // Summing all share counts
      },
    },
  ]);

  // Return the aggregated result or some default values
  return result.length
    ? result[0]
    : {
        totalReaders: 0,
        totalReactions: 0,
        totalComments: 0,
        totalShares: 0,
      };
};
const adminAnalyticsDB = async (userId: string) => {
  // Step 1: Check if the user exists and is active
  const user = await UserModel.findById(userId).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found!");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Deleted!");
  }
  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  }
  if (user?.role !== USER_ROLE.admin) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not admin !!");
  }

  // Step 2: Fetch analytics data
  const postStats = await PostModel.aggregate([
    {
      $facet: {
        totalPosts: [
          { $match: { isDelete: { $ne: true } } },
          { $count: "total" },
        ],
        totalPremiumPosts: [
          { $match: { premium: true, isDelete: { $ne: true } } },
          { $count: "total" },
        ],
        totalDeletedPosts: [
          { $match: { isDelete: true } },
          { $count: "total" },
        ],
        postMetrics: [
          { $match: { isDelete: { $ne: true } } },
          {
            $group: {
              _id: null,
              totalReaders: { $sum: 1 }, // Assuming each post represents a reader
              totalReactions: { $sum: { $size: "$react" } },
              totalComments: { $sum: { $size: "$comments" } },
              totalShares: { $sum: "$shareCount" }, // Summing all share counts
            },
          },
        ],
      },
    },
  ]);

  // Step 3: Fetch premium users count
  const totalPremiumUsers = await UserModel.countDocuments({ isVerified: true });

  // Step 4: Fetch total payments and month-wise revenue from PaymentInfoModel
  const paymentStats = await PaymentInfoModel.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" }, // Group by month (numeric format)
        },
        monthlyRevenue: { $sum: "$amount" }, // Sum of payments for each month
        totalPayments: { $sum: 1 }, // Count total payments for each month
      },
    },
    {
      $sort: { "_id.month": 1 }, // Sort by month number (from January to December)
    },
    {
      $group: {
        _id: null,
        monthlyData: {
          $push: {
            month: "$_id.month", // Month number (e.g., 1 for January, 2 for February)
            revenue: "$monthlyRevenue",
            totalPayments: "$totalPayments",
          },
        },
        totalRevenue: { $sum: "$monthlyRevenue" }, // Sum of all monthly revenues
        totalPayments: { $sum: "$totalPayments" }, // Total number of payments across all months
      },
    },
  ]);

  // Convert numeric month (1-12) to month names (January, February, etc.)
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const formattedMonthlyData = paymentStats[0]?.monthlyData.map((data:any) => ({
    month: monthNames[data.month - 1], // Convert numeric month to name
    revenue: data.revenue,
    totalPayments: data.totalPayments,
  })) || [];

  // Step 5: Format the final result for return
  const totalPosts = postStats[0]?.totalPosts?.[0]?.total || 0;
  const totalPremiumPosts = postStats[0]?.totalPremiumPosts?.[0]?.total || 0;
  const totalDeletedPosts = postStats[0]?.totalDeletedPosts?.[0]?.total || 0;
  const postMetrics = postStats[0]?.postMetrics?.[0] || {
    totalReaders: 0,
    totalReactions: 0,
    totalComments: 0,
    totalShares: 0,
  };

  const totalRevenue = paymentStats[0]?.totalRevenue || 0;
  const totalPayments = paymentStats[0]?.totalPayments || 0;

  return {
    totalPosts,
    totalPremiumPosts,
    totalDeletedPosts,
    ...postMetrics,
    totalPremiumUsers,
    monthlyData: formattedMonthlyData, // Month-wise revenue and payments
    totalRevenue, // Total revenue across all months
    totalPayments, // Total number of payments across all months
  };
};

export const userProfileService = {
  updateUserProfileDB,
  createAndRemoveFollowingDB,
  findMyProfileDB,
  myAnalyticsDB,
  adminAnalyticsDB,
};
