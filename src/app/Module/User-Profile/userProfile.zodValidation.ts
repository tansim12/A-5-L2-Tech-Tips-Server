import { Types } from "mongoose";
import { z } from "zod";

// Zod validation schema for TUserProfile
const userProfileZodSchema = z.object({
  body: z.object({
    userId: z
      .string()
      .nonempty("User ID is required")
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
      }),
    bio: z.string().optional(),
    description: z.string().optional(),
    profilePhoto: z.string().url("Invalid URL").optional(),
    coverPhoto: z.string().url("Invalid URL").optional(),
    followers: z
      .array(
        z.string().refine((val) => Types.ObjectId.isValid(val), {
          message: "Invalid follower ObjectId",
        })
      )
      .optional(),
    isVerified: z.boolean().optional(),
  }),
});

export const userProfileZodValidation = {
  userProfileZodSchema,
};
