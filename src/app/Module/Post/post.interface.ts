import { Types } from "mongoose";

export type TReact = {
  isDelete?: boolean;
  userId: Types.ObjectId;
};

export type TPost = {
  userId: Types.ObjectId;
  description: string;
  images?: string[];
  react?: TReact[];
  isDelete?: boolean;
  comments?: Types.ObjectId[];
};
