import express from "express";
import validationMiddleWare from "../../middleware/ZodSchemaValidationMiddleware";
import { authMiddleWare } from "../../middleware/AuthMiddleWare";

import { USER_ROLE } from "../User/User.const";
import { postZodValidation } from "./post.zodValidation";
import { postController } from "./post.controller";

const router = express.Router();

router.post(
  "/",
  authMiddleWare(USER_ROLE.user, USER_ROLE.admin),
  validationMiddleWare(postZodValidation.createPostZodSchema),
  postController.createPost
);
router.put(
  "/:postId",
  authMiddleWare(USER_ROLE.user),
  validationMiddleWare(postZodValidation.updatePostZodSchema),
  postController.updatePost
);
router.get(
  "/my-all-posts",
  authMiddleWare(USER_ROLE.user, USER_ROLE.admin),
  postController.myAllPost
);
router.get("/", postController.publicFindAllPost);

export const postRoute = router;
