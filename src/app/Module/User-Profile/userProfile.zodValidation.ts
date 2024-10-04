import { Types } from "mongoose";
import { z } from "zod";

// Zod validation schema for TUserProfile
const userProfileZodSchema = z.object({
  body: z.object({
    userId: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid user ID",
      })
      .optional(),
    bio: z.string().optional(),
    description: z.string().optional(),
    isCreateFollowing: z.boolean().optional(),
    profilePhoto: z.string().url("Invalid URL").optional(),
    coverPhoto: z.string().url("Invalid URL").optional(),
    followers: z
      .array(
        z.string().refine((val) => Types.ObjectId.isValid(val), {
          message: "Invalid follower ObjectId",
        })
      )
      .optional(),
  }),
});

export const userProfileZodValidation = {
  userProfileZodSchema,
};
