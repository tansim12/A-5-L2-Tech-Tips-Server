import { Types } from "mongoose";

export type TUserProfile = {
  userId: Types.ObjectId;
  bio: string;
  description?: string;
  profilePhoto: string;
  coverPhoto: string;
  followers: Types.ObjectId[];
  isVerified: boolean;
};
