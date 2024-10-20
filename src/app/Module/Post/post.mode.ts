import { model, Schema } from "mongoose";
import { TPost, TReact } from "./post.interface";
import { postCategoriesArray } from "./post.const";

const ReactSchema = new Schema<TReact>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isDelete: { type: Boolean, default: false },
});

// Define the schema for the Post model
const PostSchema: Schema<TPost> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: postCategoriesArray, // Restrict category to predefined values
      required: true,
    },
    isDelete: { type: Boolean, default: false },
    shareCount: { type: Number, default: 0 },
    premium: { type: Boolean, default: false },
    images: [{ type: String }],
    react: [ReactSchema], // Referencing users who reacted
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Referencing comments
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt timestamps

// Create the Post model
const PostModel = model<TPost>("Post", PostSchema);

export default PostModel;
