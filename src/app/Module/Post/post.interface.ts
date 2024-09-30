import { Types } from "mongoose";

export type TComment = {
  _id: Types.ObjectId; // Comment ID
  userId: Types.ObjectId; // ID of the user who made the comment
  postId: Types.ObjectId; // ID of the post to which the comment belongs
  message: string; // Comment message
  createdAt: Date; // Timestamp of when the comment was created
  replies?: TComment[]; // Array of nested replies
};
export type TPost = {
  userId: Types.ObjectId;
  description: string;
  images?: string[];
  react?: Types.ObjectId[];
  comments: TComment[];
};
