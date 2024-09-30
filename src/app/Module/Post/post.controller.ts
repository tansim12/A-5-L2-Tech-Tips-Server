import { RequestHandler } from "express";

import { successResponse } from "../../Re-Useable/CustomResponse";
import httpStatus from "http-status";
import { postService } from "./post.service";

const createPost: RequestHandler = async (req, res, next) => {
  try {
    const result = await postService.createPostDB(req?.body, req?.user?.id);
    res
      .status(200)
      .send(
        successResponse(result, httpStatus.OK, "Post Create Successfully Done")
      );
  } catch (error) {
    next(error);
  }
};
const updatePost: RequestHandler = async (req, res, next) => {
  try {
    const result = await postService.updatePostDB(req?.body, req?.user?.id,req?.params?.postId);
    res
      .status(200)
      .send(
        successResponse(result, httpStatus.OK, "Post Create Successfully Done")
      );
  } catch (error) {
    next(error);
  }
};

export const postController = {
  createPost,
  updatePost,
};
