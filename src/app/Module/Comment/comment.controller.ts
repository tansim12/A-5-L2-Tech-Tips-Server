import { RequestHandler } from "express";
import { commentsService } from "./comment.service";
import httpStatus from "http-status";
import { successResponse } from "../../Re-Useable/CustomResponse";

const commentsSetAndUpdate: RequestHandler = async (req, res, next) => {
  try {
    const result = await commentsService.commentsSetAndUpdateDB(
      req?.body,
      req?.user?.id,
      req?.params?.postId
    );
    res
      .status(200)
      .send(
        successResponse(
          result,
          httpStatus.OK,
          "Comment Create Successfully Done"
        )
      );
  } catch (error) {
    next(error);
  }
};
const commentReply: RequestHandler = async (req, res, next) => {
  try {
    const result = await commentsService.commentReplyDB(
      req?.body,
      req?.user?.id,
      req?.params?.commentId
    );
    res
      .status(200)
      .send(
        successResponse(
          result,
          httpStatus.OK,
          "Comment Delete Successfully Done"
        )
      );
  } catch (error) {
    next(error);
  }
};
const commentsDeleteAndUpdate: RequestHandler = async (req, res, next) => {
  try {
    const result = await commentsService.commentsDeleteAndUpdateDB(
      req?.user?.id,
      req?.params?.postId
    );
    res
      .status(200)
      .send(
        successResponse(
          result,
          httpStatus.OK,
          "Comment Delete Successfully Done"
        )
      );
  } catch (error) {
    next(error);
  }
};
const repliesCommentsDeleteAndUpdate: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const result = await commentsService.repliesCommentsDeleteAndUpdateDB(
      req?.user?.id,
      req?.params?.commentId
    );
    res
      .status(200)
      .send(
        successResponse(
          result,
          httpStatus.OK,
          "Comment Delete Successfully Done"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const commentsController = {
  commentsSetAndUpdate,
  commentsDeleteAndUpdate,
  commentReply,
  repliesCommentsDeleteAndUpdate,
};
