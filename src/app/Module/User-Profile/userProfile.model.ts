import { Schema, model, Types } from "mongoose";

// Define the schema
const UserProfileSchema = new Schema({
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
    default: "", // Optional field, default to an empty string
  },
  profilePhoto: {
    type: String,
    required: true,
  },
  coverPhoto: {
    type: String,
    required: true,
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
}, { timestamps: true });

// Create the model
const UserProfile = model("UserProfile", UserProfileSchema);

export default UserProfile;
