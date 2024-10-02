import { z } from "zod";
import { postCategoriesArray } from "./post.const";

// Zod schema for post validation
const createPostZodSchema = z.object({
  body: z.object({
    userId: z.string().nonempty("User ID is required"),
    description: z
      .string()
      .nonempty("Description is required")
      .max(2000, "Description cannot exceed 2000 characters"),
    images: z.array(z.string()).optional(), // Optional array of image URLs
    react: z.array(z.string()).optional(), // Optional array of user IDs who reacted
    comments: z.array(z.string()).optional(), // Optional array of comments
    isDelete: z.boolean().optional(),
  }),
});
const updatePostZodSchema = z.object({
  body: z.object({
    userId: z.string().nonempty("User ID is required").optional(),

    category: z.enum(postCategoriesArray, {
      errorMap: () => ({ message: "Invalid category" }),
    }),
    description: z
      .string()
      .nonempty("Description is required")
      .max(2000, "Description cannot exceed 2000 characters")
      .optional(),
    images: z.array(z.string()).optional(), // Optional array of image URLs
    react: z.array(z.string()).optional(), // Optional array of user IDs who reacted
    comments: z.array(z.string()).optional(), // Optional array of comments
    isDelete: z.boolean().optional(),
  }),
});

export const postZodValidation = {
  createPostZodSchema,
  updatePostZodSchema,
};
