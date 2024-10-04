import { Types } from "mongoose";

export type TUserProfile = {
  isCreateFollowing?:boolean,
  userId?: Types.ObjectId;
  bio?: string;
  description?: string;
  profilePhoto?: string;
  coverPhoto?: string;
  followers?: Types.ObjectId[];
 
};
