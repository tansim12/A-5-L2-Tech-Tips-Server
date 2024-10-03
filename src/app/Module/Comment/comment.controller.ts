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
        successResponse(result, httpStatus.OK, "React Update Successfully Done")
      );
  } catch (error) {
    next(error);
  }
};

export const commentsController = {
  commentsSetAndUpdate,
};
