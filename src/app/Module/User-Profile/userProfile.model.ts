import { Schema, model, Types } from "mongoose";
import { TUserProfile } from "./userProfile.interface";

// Define the schema
const UserProfileSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    bio: {
      type: String,
      required: true,
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
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false, // Default value if not provided
    },
  },
  { timestamps: true }
);

// Create the model
const UserProfile = model<TUserProfile>("UserProfile", UserProfileSchema);

export default UserProfile;
