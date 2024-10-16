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
const createAndRemoveFollowing: RequestHandler = async (req, res, next) => {
  try {
    const result = await userProfileService.createAndRemoveFollowingDB(
      req?.user?.id,
      req?.params?.followerId,
      req?.body
    );
    res
      .status(200)
      .send(successResponse(result, httpStatus.OK, "Following Update Done"));
  } catch (error) {
    next(error);
  }
};
const findMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const result = await userProfileService.findMyProfileDB(req?.user?.id);
    res
      .status(200)
      .send(
        successResponse(
          result,
          httpStatus.OK,
          "Find My Profile Successfully Done"
        )
      );
  } catch (error) {
    next(error);
  }
};
const myAnalytics: RequestHandler = async (req, res, next) => {
  try {
    const result = await userProfileService.myAnalyticsDB(req?.user?.id);
    res
      .status(200)
      .send(successResponse(result, httpStatus.OK, "Find My Analytics Done"));
  } catch (error) {
    next(error);
  }
};
const adminAnalytics: RequestHandler = async (req, res, next) => {
  try {
    const result = await userProfileService.adminAnalyticsDB(req?.user?.id);
    res
      .status(200)
      .send(
        successResponse(result, httpStatus.OK, "Find Admin Analytics Done")
      );
  } catch (error) {
    next(error);
  }
};

export const userProfileController = {
  updateUserProfile,
  createAndRemoveFollowing,
  findMyProfile,
  myAnalytics,
  adminAnalytics,
};
