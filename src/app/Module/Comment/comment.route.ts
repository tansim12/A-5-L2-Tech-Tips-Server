import express from "express";
import { authMiddleWare } from "../../middleware/AuthMiddleWare";
import { USER_ROLE } from "../User/User.const";
import { commentZodValidation } from "./comment.zodValidation";
import { commentsController } from "./comment.controller";
import validationMiddleWare from "../../middleware/ZodSchemaValidationMiddleware";
const router = express.Router();

router.put(
  "/:postId",
  authMiddleWare(USER_ROLE.user, USER_ROLE.admin),
  validationMiddleWare(commentZodValidation.commentZodSchema),
  commentsController.commentsSetAndUpdate
);
router.delete(
  "/:postId",
  authMiddleWare(USER_ROLE.user, USER_ROLE.admin),
  commentsController.commentsDeleteAndUpdate
);

export const commentsRouter = router;
