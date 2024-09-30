import { model, Schema } from "mongoose";
import { TPost } from "./post.interface";

// Define the schema for the Post model
const PostSchema: Schema<TPost> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    description: { type: String, required: true },
    images: [{ type: String }],
    react: [{ type: Schema.Types.ObjectId, ref: "User" }], // Referencing users who reacted
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Referencing comments
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt timestamps

// Create the Post model
const PostModel = model<TPost>("Post", PostSchema);

export default PostModel;
