import { Schema, model, } from "mongoose";
import { TUserProfile } from "./userProfile.interface";

// Define the schema
const UserProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    bio: {
      type: String,
    },
    description: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
    coverPhoto: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Create the model
const UserProfileModel = model<TUserProfile>("UserProfile", UserProfileSchema);

export default UserProfileModel;
