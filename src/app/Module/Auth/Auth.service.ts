import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { validateLoginPassword } from "../../Re-Useable/BcryptValidatin";
import { TUser } from "../User/User.interface";
import { UserModel } from "../User/User.model";
import { TChangePassword, TSignIn } from "./Auth.interface";
import { dynamicTokenGenerate } from "./Auth.utils";
import dotenv from "dotenv";
dotenv.config();
import { USER_STATUS } from "../User/User.const";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import Bcrypt from "bcrypt";
import UserProfileModel from "../User-Profile/userProfile.model";
import mongoose from "mongoose";
import { emailSender } from "../../Utils/emailSender";

const singUpDB = async (payload: Partial<TUser>) => {
  const session = await mongoose.startSession(); // Start a new session for the transaction
  session.startTransaction(); // Begin the transaction

  try {
    // Check if the user already exists
    const user = await UserModel.findOne({
      $or: [{ email: payload?.email }, { phone: payload?.phone }],
    })
      .select("email")
      .session(session); // Add session to the query

    if (user) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "This User Already Exists. Change Email Or Phone Number"
      );
    }

    // Create the new user
    const result = await UserModel.create([payload], { session }); // Use session in create

    if (!result[0]?._id) {
      throw new AppError(httpStatus.EXPECTATION_FAILED, "User Creation Failed");
    }

    // Create the user profile
    const createUserProfile = await UserProfileModel.create(
      [
        {
          userId: result[0]?._id,
          profilePhoto: result[0]?.profilePhoto,
        },
      ],
      { session }
    );

    if (!createUserProfile[0]?._id) {
      throw new AppError(
        httpStatus.EXPECTATION_FAILED,
        "User Profile Creation Failed"
      );
    }

    // Update the user with the profile ID
    await UserModel.updateOne(
      { _id: result[0]?._id },
      { userProfile: createUserProfile[0]._id }, // Set the userProfile to the created profile ID
      { session }
    );

    // If both user and profile creation succeeded, commit the transaction
    await session.commitTransaction();

    // Generate JWT tokens
    const jwtPayload = {
      id: result[0]?._id,
      role: result[0]?.role as string,
      isVerified: result[0]?.isVerified,
      profilePhoto: result[0]?.profilePhoto,
      phone: result[0]?.phone,
      email: result[0]?.email,
      name: result[0]?.name,
    };

    const accessToken = dynamicTokenGenerate(
      jwtPayload,
      process.env.SECRET_ACCESS_TOKEN as string,
      process.env.SECRET_ACCESS_TOKEN_TIME as string
    );
    const refreshToken = dynamicTokenGenerate(
      jwtPayload,
      process.env.SECRET_REFRESH_TOKEN as string,
      process.env.SECRET_REFRESH_TOKEN_TIME as string
    );

    if (!accessToken) {
      throw new AppError(httpStatus.CONFLICT, "Something Went Wrong!");
    }

    // Return the tokens
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    // If any error occurs, rollback the transaction
    await session.abortTransaction();
    throw error; // Re-throw the error to be handled by the caller
  } finally {
    // End the session
    session.endSession();
  }
};

const signInDB = async (payload: TSignIn) => {
  const { email, password } = payload;
  const user = await UserModel.findOne({ email: email }).select("+password");
  if (!user) {
    throw new AppError(404, "No Data Found");
  }
  const isDelete = user?.isDelete;
  if (isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Already Delete !");
  }
  const isBlock = user?.status;
  if (isBlock === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Already Blocked !");
  }
  const checkPassword = await validateLoginPassword(password, user?.password);
  if (!checkPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Password dose not matched !!"
    );
  }

  const jwtPayload = {
    id: user?._id,
    role: user?.role as string,
    isVerified: user?.isVerified,
    profilePhoto: user?.profilePhoto,
    phone: user?.phone,
    email: user?.email,
    name: user?.name,
  };

  const accessToken = dynamicTokenGenerate(
    jwtPayload,
    process.env.SECRET_ACCESS_TOKEN as string,
    process.env.SECRET_ACCESS_TOKEN_TIME as string
  );
  const refreshToken = dynamicTokenGenerate(
    jwtPayload,
    process.env.SECRET_REFRESH_TOKEN as string,
    process.env.SECRET_REFRESH_TOKEN_TIME as string
  );
  if (!accessToken) {
    throw new AppError(httpStatus.CONFLICT, "Something Went Wrong !!");
  }

  return {
    accessToken,
    refreshToken,
  };
};

const refreshTokenDB = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !!!");
  }

  const decoded = jwt.verify(
    token as string,
    process.env.SECRET_REFRESH_TOKEN as string
  );

  // validation is exists
  const { id } = (decoded as JwtPayload).data;
  const { iat } = decoded as JwtPayload;

  const user = await UserModel.findById(id).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found !");
  }

  // validate isExistsUserDeleted
  const isExistsUserDeleted = user?.isDelete;
  if (isExistsUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Deleted !");
  }

  const isExistsUserStatus = user?.status;
  if (isExistsUserStatus === USER_STATUS?.block) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Blocked !");
  }

  const passwordChangeConvertMilliSecond =
    new Date(user?.passwordChangeAt as Date).getTime() / 1000;
  const jwtIssueTime = iat as number;

  if (passwordChangeConvertMilliSecond > jwtIssueTime) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
  }

  // implements jwt token
  const jwtPayload = {
    id: user?._id,
    role: user?.role as string,
  };

  const accessToken = dynamicTokenGenerate(
    jwtPayload,
    process.env.SECRET_ACCESS_TOKEN as string,
    process.env.SECRET_ACCESS_TOKEN_TIME as string
  );

  return { accessToken };
};

const changePasswordDB = async (id: string, payload: TChangePassword) => {
  const { oldPassword, newPassword } = payload;

  // validation is exists
  const user = await UserModel.findById(id).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found !");
  }
  // validate isExistsUserDeleted
  const isExistsUserDeleted = user?.isDelete;
  if (isExistsUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Deleted !");
  }
  const isExistsUserStatus = user?.status;
  if (isExistsUserStatus === USER_STATUS?.block) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Blocked !");
  }
  // check password is correct
  const checkPassword = await validateLoginPassword(
    oldPassword,
    user?.password
  );
  if (!checkPassword) {
    throw new AppError(
      400,
      "Old Password dose not matched... Try again letter 😥"
    );
  }
  // updating user model needPassword change false and password bcrypt
  let newPasswordBcrypt;
  if (checkPassword) {
    newPasswordBcrypt = await Bcrypt.hash(
      newPassword,
      Number(process.env.BCRYPT_NUMBER)
    );
  }
  if (!newPasswordBcrypt) {
    throw new AppError(400, "Password Not Change here");
  }
  const result = await UserModel.findByIdAndUpdate(id, {
    password: newPasswordBcrypt,
    passwordChangeAt: new Date(),
  });

  if (result) {
    return null;
  } else {
    throw new AppError(400, "Password Not Change here");
  }
};

const forgetPasswordDB = async (payload: TChangePassword) => {
  const { id } = payload;

  // validation is exists
  const user = await UserModel.findById({ _id: id }).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found !");
  }
  // validate isExistsUserDeleted
  const isExistsUserDeleted = user?.isDelete;
  if (isExistsUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Deleted !");
  }
  const isExistsUserStatus = user?.status;
  if (isExistsUserStatus === USER_STATUS?.block) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Blocked !");
  }

  const jwtPayload = {
    id: user?._id, // Change 'userId' to 'id'
    role: user?.role || "user", // Ensure role is always a string, default to 'user'
  };

  const resetToken = dynamicTokenGenerate(
    jwtPayload,
    process.env.SECRET_ACCESS_TOKEN as string,
    "10m"
  );

  const resetUILink = `${process.env.FRONTEND_URL}/forget-password?id=${user.id}&token=${resetToken} `;
  await emailSender(user?.email, resetUILink);
  // updating user model needPassword change false and password bcrypt
  // let newPasswordBcrypt;
  // if (checkPassword) {
  //   newPasswordBcrypt = await Bcrypt.hash(
  //     newPassword,
  //     Number(process.env.BCRYPT_NUMBER)
  //   );
  // }
  // if (!newPasswordBcrypt) {
  //   throw new AppError(400, "Password Not Change here");
  // }
};

export const authService = {
  signInDB,
  singUpDB,
  refreshTokenDB,
  changePasswordDB,
  forgetPasswordDB,
};
