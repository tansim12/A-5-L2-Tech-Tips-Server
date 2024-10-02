import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { UserModel } from "../User/User.model";
import { TPost } from "./post.interface";
import { USER_STATUS } from "../User/User.const";
import PostModel from "./post.mode";
import QueryBuilder2 from "../../Builder/QueryBuilder2";
import { postSearchableFields } from "./post.const";

const createPostDB = async (payload: Partial<TPost>, userId: string) => {
  const user = await UserModel.findById({ _id: userId }).select("+password");
  const existDB = await UserModel.findById({ _id: payload?.userId }).select(
    "+password"
  );

  if (payload?.premium === true && user?.isVerified === false) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Access denied. This post is only for verified users."
    );
  }
  if (!user || !existDB) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found !");
  }

  if (user?.isDelete || existDB?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Delete !");
  }

  if (
    user?.status === USER_STATUS.block ||
    existDB?.status === USER_STATUS.block
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  }
  const result = await PostModel.create(payload);
  if (!result) {
    throw new AppError(httpStatus.EXPECTATION_FAILED, "Post Create Failed");
  }
  return result;
};

const updatePostDB = async (
  payload: Partial<TPost>,
  userId: string,
  postId: string
) => {
  const user = await UserModel.findById({ _id: userId }).select(
    "name email phone isDelete status"
  );
  const post = await PostModel.findById({ _id: postId }).select("_id isDelete");

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post Not found !");
  }

  if (post?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post Already Delete !");
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
  const result = await PostModel.findByIdAndUpdate(
    { _id: postId },
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
    throw new AppError(httpStatus.EXPECTATION_FAILED, "Post Update Failed");
  }
  return result;
};

const publicFindAllPostDB = async (queryParams: Partial<TPost>) => {
  const queryPost = new QueryBuilder2(
    PostModel.find().populate({
      path: "userId",
      select: "name isVerified profilePhoto role",
    }),
    queryParams
  )
    .fields()
    .filter()
    .paginate()
    .search(postSearchableFields)
    .sort();
  const result = await queryPost.modelQuery;
  const meta = await queryPost.countTotal();
  return { meta, result };
};

export const postService = {
  createPostDB,
  updatePostDB,
  publicFindAllPostDB,
};
