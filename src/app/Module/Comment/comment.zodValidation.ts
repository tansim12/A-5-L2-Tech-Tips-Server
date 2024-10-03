import { z } from "zod";

// Zod schema for comment validation
const commentZodSchema = z.object({
  body: z.object({
    userId: z.string().nonempty("User ID is required").optional(),
    postId: z.string().nonempty("Post ID is required").optional(),
    previousCommentId: z
      .string()
      .nonempty("previousCommentId ID is required")
      .optional(),
    message: z
      .string()
      .nonempty("Comment message is required")
      .max(500, "Comment message cannot exceed 500 characters"),
    replies: z.array(z.string()).optional(), // Optional nested comments
  }),
});
export const commentZodValidation = {
  commentZodSchema,
};
