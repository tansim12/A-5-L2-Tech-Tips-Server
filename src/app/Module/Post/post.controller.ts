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

// update
const updatePost: RequestHandler = async (req, res, next) => {
  try {
    const result = await postService.updatePostDB(
      req?.body,
      req?.user?.id,
      req?.params?.postId
    );
    res
      .status(200)
      .send(
        successResponse(result, httpStatus.OK, "Post Update Successfully Done")
      );
  } catch (error) {
    next(error);
  }
};
const reactSetAndUpdate: RequestHandler = async (req, res, next) => {
  try {
    const result = await postService.reactSetAndUpdateDB(
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

// find
const publicFindAllPost: RequestHandler = async (req, res, next) => {
  try {
    const result = await postService.publicFindAllPostDB(req?.query);
    res
      .status(200)
      .send(
        successResponse(result, httpStatus.OK, "Post Find Successfully Done")
      );
  } catch (error) {
    next(error);
  }
};
const myAllPost: RequestHandler = async (req, res, next) => {
  try {
    const result = await postService.myAllPostDB(req?.query, req?.user?.id);
    res
      .status(200)
      .send(
        successResponse(result, httpStatus.OK, "Post Find Successfully Done")
      );
  } catch (error) {
    next(error);
  }
};
const publicFindSinglePost: RequestHandler = async (req, res, next) => {
  try {
    const result = await postService.publicFindSinglePostDB(
      req?.params?.postId
    );
    res
      .status(200)
      .send(
        successResponse(result, httpStatus.OK, "Post Find Successfully Done")
      );
  } catch (error) {
    next(error);
  }
};

// find
const adminGetsAllPost: RequestHandler = async (req, res, next) => {
  try {
    const result = await postService.adminGetsAllPostDB(
      req?.user?.id,
      req?.query
    );
    res
      .status(200)
      .send(
        successResponse(result, httpStatus.OK, "Post Find Successfully Done")
      );
  } catch (error) {
    next(error);
  }
};
const updatePostShare: RequestHandler = async (req, res, next) => {
  try {
    const result = await postService.updatePostShareDB(
      req?.params?.postId,
      req?.body
    );
    res
      .status(200)
      .send(
        successResponse(result, httpStatus.OK, "Post Share Successfully Done")
      );
  } catch (error) {
    next(error);
  }
};

export const postController = {
  createPost,
  updatePost,
  publicFindAllPost,
  myAllPost,
  publicFindSinglePost,
  reactSetAndUpdate,
  adminGetsAllPost,
  updatePostShare,
};
