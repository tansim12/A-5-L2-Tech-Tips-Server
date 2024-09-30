import { model, Schema } from "mongoose";
import { TPost, TReact } from "./post.interface";

const ReactSchema = new Schema<TReact>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Define the schema for the Post model
const PostSchema: Schema<TPost> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    description: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    images: [{ type: String }],
    react: [ReactSchema], // Referencing users who reacted
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Referencing comments
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt timestamps

// Create the Post model
const PostModel = model<TPost>("Post", PostSchema);

export default PostModel;
