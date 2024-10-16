import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { UserModel } from "../User/User.model";
import { TPost } from "./post.interface";
import { USER_ROLE, USER_STATUS } from "../User/User.const";
import PostModel from "./post.mode";
import QueryBuilder2 from "../../Builder/QueryBuilder2";
import { postSearchableFields } from "./post.const";

const createPostDB = async (payload: Partial<TPost>, userId: string) => {
  const user = await UserModel.findById({ _id: userId }).select("+password");

  if (payload?.premium === true && user?.isVerified === false) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Access denied. This post is only for verified users."
    );
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
  const result = await PostModel.create({ ...payload, userId });
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
  const user = await UserModel.findById({ _id: userId }).select("+password");
  const post = await PostModel.findById({ _id: postId }).select(
    "_id isDelete userId"
  );

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

  if (user?.role === USER_ROLE.user) {
    if (post?.userId?.toString() !== userId.toString()) {
      throw new AppError(httpStatus.BAD_REQUEST, "This is not his post !!");
    }
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

const myAllPostDB = async (queryParams: Partial<TPost>, userId: string) => {
  const queryPost = new QueryBuilder2(
    PostModel.find({ userId, isDelete: false })
      .populate({
        path: "userId", // Populate userId with selected fields
        select: "name isVerified profilePhoto role",
      })
      .populate({
        path: "comments", // Populate comments with selected fields
        populate: [
          {
            path: "userId", // Further populate the userId inside comments
            select: "name isVerified profilePhoto",
          },
          {
            path: "replies", // Populate replies within comments
            populate: {
              path: "userId", // Populate userId within replies
              select: "name isVerified profilePhoto",
            },
          },
        ],
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

const reactSetAndUpdateDB = async (
  payload: Partial<TPost>,
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
  };

  //  added react
  if (newPayload?.isDelete === false) {
    const result = await PostModel.findOneAndUpdate(
      { _id: postId, "react.userId": { $ne: user?._id } },
      { $addToSet: { react: newPayload } },
      { new: true }
    ).select("react");

    if (!result) {
      throw new AppError(httpStatus.EXPECTATION_FAILED, "Already Vote Done");
    }
    return result;
  }

  //  remove react
  if (newPayload?.isDelete === true) {
    const result = await PostModel.findOneAndUpdate(
      {
        _id: postId,
        "react.userId": user._id, // Ensure userId is not already in the react array
      },
      {
        $pull: { react: { userId: user._id, isDelete: false } }, // Modify criteria as needed
      },
      {
        new: true, // Return the updated document
      }
    ).select("react");

    if (!result) {
      throw new AppError(httpStatus.EXPECTATION_FAILED, "Already Vote Remove");
    }
    return result;
  }
};

// ! public section
const publicFindAllPostDB = async (queryParams: Partial<TPost>) => {
  const queryPost = new QueryBuilder2(
    PostModel.find({ isDelete: false })
      .populate({
        path: "userId", // Populate userId with selected fields
        select: "name isVerified profilePhoto role",
      })
      .populate({
        path: "comments", // Populate comments with selected fields
        populate: [
          {
            path: "userId", // Further populate the userId inside comments
            select: "name isVerified profilePhoto",
          },
          {
            path: "replies", // Populate replies within comments
            populate: {
              path: "userId", // Populate userId within replies
              select: "name isVerified profilePhoto",
            },
          },
        ],
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

const publicFindSinglePostDB = async (postId: string) => {
  const result = await PostModel.findById({ _id: postId }).populate({
    path: "userId",
    select: "name isVerified profilePhoto role",
  });

  if (!result?._id) {
    throw new AppError(httpStatus.NOT_FOUND, "Data Not Found");
  }
  if (result?.isDelete) {
    throw new AppError(httpStatus.NOT_FOUND, "Data Already Delete");
  }
  return result;
};

// ! admin get all post  section
const adminGetsAllPostDB = async (
  userId: string,
  queryParams: Partial<TPost>
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
  if (user?.role !== USER_ROLE.admin) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not admin");
  }

  const queryPost = new QueryBuilder2(
    PostModel.find()
      .populate({
        path: "userId", // Populate userId with selected fields
        select: "name isVerified profilePhoto role",
      })
      .populate({
        path: "comments", // Populate comments with selected fields
        populate: [
          {
            path: "userId", // Further populate the userId inside comments
            select: "name isVerified profilePhoto",
          },
          {
            path: "replies", // Populate replies within comments
            populate: {
              path: "userId", // Populate userId within replies
              select: "name isVerified profilePhoto",
            },
          },
        ],
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
  myAllPostDB,
  publicFindSinglePostDB,
  reactSetAndUpdateDB,
  adminGetsAllPostDB,
};
