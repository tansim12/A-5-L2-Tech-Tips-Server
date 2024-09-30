import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { UserModel } from "../User/User.model";
import { TUserProfile } from "./userProfile.interface";
import { USER_STATUS } from "../User/User.const";

const updateUserProfileDB = async (
  payload: Partial<TUserProfile>,
  userId: string
) => {
  const user = await UserModel.findById({ _id: userId }).select(
    "name email phone isDelete status"
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found !");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Delete !");
  }

  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  }

  const result = await user
};
export const userProfileService = {
  updateUserProfileDB,
};
