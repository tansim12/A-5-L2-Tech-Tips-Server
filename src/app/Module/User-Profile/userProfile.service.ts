import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { UserModel } from "../User/User.model";
import { TUserProfile } from "./userProfile.interface";
import { USER_STATUS } from "../User/User.const";
import UserProfileModel from "./userProfile.model";

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

const createFollowingDB = async (userId: string, followersId: string) => {
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
};

export const userProfileService = {
  updateUserProfileDB,
  createFollowingDB,
};
