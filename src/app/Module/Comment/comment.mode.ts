import { model, Schema } from "mongoose";
import { TComment } from "./comment.interface";

// Define the schema for the Comment model
const CommentSchema: Schema<TComment> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    isDelete: { type: Boolean, default: false },
    message: { type: String, required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Referencing nested comments
  },
  {
    timestamps: true,
  }
);
// Create the Comment model
const CommentModel = model<TComment>("Comment", CommentSchema);
export default CommentModel;
