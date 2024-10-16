import express from "express";
import validationMiddleWare from "../../middleware/ZodSchemaValidationMiddleware";
import { authMiddleWare } from "../../middleware/AuthMiddleWare";
import { userProfileController } from "./userProfile.controller";
import { userProfileZodValidation } from "./userProfile.zodValidation";
import { USER_ROLE } from "../User/User.const";

const router = express.Router();

router.put(
  "/",
  authMiddleWare(USER_ROLE.user, USER_ROLE.admin),
  validationMiddleWare(userProfileZodValidation.userProfileZodSchema),
  userProfileController.updateUserProfile
);
router.put(
  "/create-and-remove-followers/:followerId",
  authMiddleWare(USER_ROLE.user, USER_ROLE.admin),
  validationMiddleWare(userProfileZodValidation.userProfileZodSchema),
  userProfileController.createAndRemoveFollowing
);
router.get(
  "/",
  authMiddleWare(USER_ROLE.user, USER_ROLE.admin),
  userProfileController.findMyProfile
);
router.get(
  "/my-analytics",
  authMiddleWare(USER_ROLE.user, USER_ROLE.admin),
  userProfileController.myAnalytics
);
router.get(
  "/admin-analytics",
  authMiddleWare(USER_ROLE.admin),
  userProfileController.adminAnalytics
);

export const userProfileRoute = router;
