import { z } from "zod";
import { postCategoriesArray } from "./post.const";

const reactSchema = z.object({
  isDelete: z.boolean(), // Optional field to represent deletion status
});

// Zod schema for post validation
const createPostZodSchema = z.object({
  body: z.object({
    userId: z.string().nonempty("User ID is required").optional(),
    title: z
      .string({ required_error: "Title is required" })
      .max(70, "Title cannot exceed 70 characters"),
    category: z.enum(postCategoriesArray, {
      errorMap: () => ({ message: "Invalid category" }),
    }),
    description: z
      .string()
      .nonempty("Description is required")
      .max(5000, "Description cannot exceed 5000 characters"),
    images: z.array(z.string()).optional(), // Optional array of image URLs
    react: z.array(z.string()).optional(), // Optional array of user IDs who reacted
    comments: z.array(z.string()).optional(), // Optional array of comments
    isDelete: z.boolean().optional(),
    premium: z.boolean().optional(),
  }),
});
const updatePostZodSchema = z.object({
  body: z.object({
    userId: z.string().nonempty("User ID is required").optional(),
    title: z
      .string({ required_error: "Title is required" })
      .max(70, "Title cannot exceed 70 characters")
      .optional(),
    category: z
      .enum(postCategoriesArray, {
        errorMap: () => ({ message: "Invalid category" }),
      })
      .optional(),
    description: z
      .string()
      .nonempty("Description is required")
      .max(2000, "Description cannot exceed 2000 characters")
      .optional(),
    images: z.array(z.string()).optional(), // Optional array of image URLs
    react: z.array(reactSchema).optional(), // Optional array of user IDs who reacted
    comments: z.array(z.string()).optional(), // Optional array of comments
    isDelete: z.boolean().optional(),
    premium: z.boolean().optional(),
  }),
});

export const postZodValidation = {
  createPostZodSchema,
  updatePostZodSchema,
};
