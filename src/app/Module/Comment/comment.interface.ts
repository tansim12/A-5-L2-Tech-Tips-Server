import { Types } from "mongoose";

export type TComment = {
  isReply?:boolean,
  userId?: Types.ObjectId; // ID of the user who made the comment
  postId?: Types.ObjectId; // ID of the post to which the comment belongs
  message: string; // Comment message
  isDelete?: boolean;
  replies?: TComment[]; // Array of nested replies
};
