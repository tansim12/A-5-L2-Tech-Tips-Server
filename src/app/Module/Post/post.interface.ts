import { Types } from "mongoose";
import { TComment } from "../Comment/comment.interface";

export type TPost = {
  userId: Types.ObjectId;
  description: string;
  images?: string[];
  react?: Types.ObjectId[];
  comments?: TComment[];
};
