import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import PostModel from "../Post/post.mode";
import CommentModel from "./comment.mode";
import { UserModel } from "../User/User.model";
import { USER_STATUS } from "../User/User.const";
import { TComment } from "./comment.interface";
import mongoose from "mongoose";

// create
const commentsSetAndUpdateDB = async (
  payload: Partial<TComment>,
  userId: string,
  postId: string
) => {
  // Start a session for the transaction
  const session = await mongoose.startSession();

  try {
    // Start the transaction
    session.startTransaction();

    // Find user and validate
    const user = await UserModel.findById({ _id: userId })
      .select("+password")
      .session(session); // Use session in queries

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not found!");
    }

    if (user?.isDelete) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Deleted!");
    }

    if (user?.status === USER_STATUS?.block) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
    }

    // Create new comment payload with userId and postId
    const newPayload = {
      ...payload,
      userId: user?._id,
      postId,
    };

    // Add the new comment to the database
    const resultComment = await CommentModel.create([newPayload], { session });

    if (!resultComment || !resultComment[0]) {
      throw new AppError(httpStatus.EXPECTATION_FAILED, "Comment Post Failed!");
    }

    // Update the post to add the comment reference
    const resultPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { comments: resultComment?.[0]?._id } },
      { new: true }
    )
      .select("comments")
      .session(session);

    if (!resultPost) {
      throw new AppError(
        httpStatus.EXPECTATION_FAILED,
        "Comment Update Failed!"
      );
    }

    // Commit the transaction if all operations are successful
    await session.commitTransaction();
    session.endSession();

    return resultPost; // Return the updated post with the comment
  } catch (error) {
    // Abort the transaction and roll back the changes in case of error
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "RollBack Comment create failed"
    );
  }
};

// delete
const commentsDeleteAndUpdateDB = async (userId: string, commentId: string) => {
  // Start a session to initiate a transaction
  const session = await mongoose.startSession();

  try {
    // Start transaction
    session.startTransaction();

    // Check if user exists and is valid
    const user = await UserModel.findById({ _id: userId })
      .select("+password")
      .session(session); // Use session in queries

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not found!");
    }

    if (user.isDelete) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Deleted!");
    }

    if (user.status === USER_STATUS.block) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
    }

    // Check if comment exists and belongs to the user
    const comment = await CommentModel.findById({ _id: commentId })
      .select("postId userId")
      .session(session);

    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, "Comment Not Found!");
    }

    if (comment?.userId!.toString() !== userId.toString()) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot delete this comment!"
      );
    }

    // Delete the comment
    const resultComment = await CommentModel.findByIdAndDelete({
      _id: commentId,
    }).session(session);
    if (!resultComment) {
      throw new AppError(
        httpStatus.EXPECTATION_FAILED,
        "Comment Delete Failed!"
      );
    }

    // Update the post by removing the comment from the post's comments array
    const resultPost = await PostModel.findOneAndUpdate(
      { _id: comment?.postId },
      { $pull: { comments: commentId } },
      { new: true }
    )
      .select("comments")
      .session(session);

    if (!resultPost) {
      throw new AppError(
        httpStatus.EXPECTATION_FAILED,
        "Failed to update the post!"
      );
    }

    // Commit the transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    return resultPost; // Return the updated post data
  } catch (error) {
    // Rollback transaction if anything fails
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.BAD_REQUEST,
      "RollBack Comment delete failed"
    );
  }
};


const repliesCommentsDeleteAndUpdateDB = async (
  userId: string,
  commentId: string
) => {
    
  // Start a session to initiate a transaction
  const session = await mongoose.startSession();

  try {
    // Start transaction
    session.startTransaction();

    // Check if user exists and is valid
    const user = await UserModel.findById({ _id: userId })
      .select("+password")
      .session(session); // Use session in queries

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not found!");
    }

    if (user.isDelete) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Deleted!");
    }

    if (user.status === USER_STATUS.block) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
    }

    // Check if comment exists and belongs to the user
    const comment = await CommentModel.findById({ _id: commentId })
      .select("postId userId previousCommentId")
      .session(session);

    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, "Comment Not Found!");
    }

    if (comment?.userId!.toString() !== userId.toString()) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot delete this comment!"
      );
    }

    // Delete the comment
    const resultComment = await CommentModel.findByIdAndDelete({
      _id: commentId,
    }).session(session);


    
    if (!resultComment) {
      throw new AppError(
        httpStatus.EXPECTATION_FAILED,
        "Comment Delete Failed!"
      );
    }

    // Update the post by removing the comment from the post's comments array
    const resultPost = await CommentModel.findOneAndUpdate(
      { _id: comment?.previousCommentId },
      { $pull: { replies: commentId } },
      { new: true }
    )
      .select("replies")
      .session(session);
      
    if (!resultPost) {
      throw new AppError(
        httpStatus.EXPECTATION_FAILED,
        "Failed to update the post!"
      );
    }

    // Commit the transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    return resultPost; // Return the updated post data
  } catch (error) {
    // Rollback transaction if anything fails
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.BAD_REQUEST,
      "RollBack Comment delete failed"
    );
  }
};

const commentReplyDB = async (
  payload: Partial<TComment>,
  userId: string,
  commentId: string
) => {
  // Start a session for the transaction
  const session = await mongoose.startSession();

  try {
    // Start the transaction
    session.startTransaction();

    // Find user and validate
    const user = await UserModel.findById({ _id: userId })
      .select("+password")
      .session(session); // Use session in queries

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not found!");
    }

    if (user?.isDelete) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Deleted!");
    }

    if (user?.status === USER_STATUS?.block) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
    }

    // Check if comment exists and belongs to the user
    const comment = await CommentModel.findById({ _id: commentId })
      .select("postId userId")
      .session(session);

    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, "Comment Not Found!");
    }

    // Create new comment payload with userId and postId
    const newPayload = {
      ...payload,
      userId: user?._id,
      postId: comment?.postId,
      previousCommentId:comment?._id
    };

    // Add the new comment to the database
    const resultComment = await CommentModel.create([newPayload], { session });

    if (!resultComment || !resultComment[0]) {
      throw new AppError(httpStatus.EXPECTATION_FAILED, "Comment Post Failed!");
    }

    // Update the post to add the comment reference
    const resultPost = await CommentModel.findOneAndUpdate(
      { _id: commentId },
      { $addToSet: { replies: resultComment?.[0]?._id } },
      { new: true }
    )
      .select("comments")
      .session(session);

    if (!resultPost) {
      throw new AppError(
        httpStatus.EXPECTATION_FAILED,
        "Comment Update Failed!"
      );
    }

    // Commit the transaction if all operations are successful
    await session.commitTransaction();
    session.endSession();

    return resultPost; // Return the updated post with the comment
  } catch (error) {
    // Abort the transaction and roll back the changes in case of error
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "RollBack Comment create failed"
    );
  }
};

export const commentsService = {
  commentsSetAndUpdateDB,
  commentsDeleteAndUpdateDB,
  commentReplyDB,
  repliesCommentsDeleteAndUpdateDB,
};
