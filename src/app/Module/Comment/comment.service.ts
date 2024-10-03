import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import PostModel from "../Post/post.mode";
import CommentModel from "./comment.mode";
import { UserModel } from "../User/User.model";
import { USER_STATUS } from "../User/User.const";
import { TComment } from "./comment.interface";

const commentsSetAndUpdateDB = async (
  payload: Partial<TComment>,
  userId: string,
  postId: string
) => {
  const user = await UserModel.findById({ _id: userId }).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found !");
  }

  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Delete !");
  }

  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  }
  const newPayload = {
    ...payload,
    userId: user?._id,
    postId,
  };

  //  added react

  const resultComment = await CommentModel.create(newPayload);
  if (!resultComment) {
    throw new AppError(httpStatus.EXPECTATION_FAILED, "Comment Post Failed");
  }
  const result = await PostModel.findOneAndUpdate(
    { _id: postId },
    { $addToSet: { comments: resultComment?._id } },
    { new: true }
  ).select("comments");

  if (!result) {
    throw new AppError(httpStatus.EXPECTATION_FAILED, "Already Comment Done");
  }

  return result;
};

export const commentsService = {
  commentsSetAndUpdateDB,
};
