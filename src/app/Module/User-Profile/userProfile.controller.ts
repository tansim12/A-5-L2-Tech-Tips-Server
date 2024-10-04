import { RequestHandler } from "express";
import { userProfileService } from "./userProfile.service";
import { successResponse } from "../../Re-Useable/CustomResponse";
import httpStatus from "http-status";

const updateUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const result = await userProfileService.updateUserProfileDB(
      req?.body,
      req?.user?.id
    );
    res
      .status(200)
      .send(successResponse(result, httpStatus.OK, "User Profile Update Done"));
  } catch (error) {
    next(error);
  }
};
const createFollowing: RequestHandler = async (req, res, next) => {
  try {
    const result = await userProfileService.createFollowingDB(
      req?.user?.id,
      req?.params?.followerId
    );
    res
      .status(200)
      .send(successResponse(result, httpStatus.OK, "Following Done"));
  } catch (error) {
    next(error);
  }
};

export const userProfileController = {
  updateUserProfile,
  createFollowing,
};
