/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import dotenv from "dotenv";
import { UserModel } from "../User/User.model";
import AppError from "../../Error-Handle/AppError";
import httpStatus from "http-status";
import { USER_ROLE, USER_STATUS } from "../User/User.const";
dotenv.config();
import { v7 as uuidv7 } from "uuid";
import { verifyPayment } from "../../Utils/verifyPayment";
import PaymentInfoModel from "./payment.model";
import { startSession } from "mongoose";
import { TPaymentInfo } from "./payment.interface";
import QueryBuilder2 from "../../Builder/QueryBuilder2";
import { paymentInfoSearchTerm } from "./Payment.const";

const paymentDB = async (body: any, userId: string) => {
  const user = await UserModel.findById({ _id: userId }).select(
    "name email phone isDelete status"
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found !");
  }

  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Delete !");
  }

  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  }

  const transactionId = uuidv7(); // Generate a UUID
  const currentTime = new Date().toISOString(); // or use Date.now() for a timestamp in milliseconds

  // Concatenate UUID with current time
  const combinedTransactionId = `${transactionId}-${currentTime}`;
  const formData = {
    cus_name: `${user?.name ? user?.name : "N/A"}`,
    cus_email: `${user?.email ? user?.email : "N/A"}`,
    cus_phone: `${user?.phone ? user?.phone : "N/A"}`,
    amount: body?.amount,
    tran_id: combinedTransactionId,
    signature_key: process.env.AAMAR_PAY_SIGNATURE_KEY,
    // store_id: process.env.AAMAR_PAY_STORE_ID,
    store_id: "aamarpaytest",
    currency: "BDT",
    desc: combinedTransactionId,
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_country: "Bangladesh",
    success_url: `${process.env.BASE_URL}/api/payment/callback?txnId=${combinedTransactionId}&userId=${user?._id}`,

    fail_url: `${process.env.BASE_URL}/api/payment/callback`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`, // its redirect to frontend directly
    type: "json", //This is must required for JSON request
  };

  const { data } = await axios.post(
    `${process.env.AAMAR_PAY_HIT_API}`,
    formData
  );

  if (data.result !== "true") {
    let errorMessage = "";
    for (const key in data) {
      errorMessage += data[key] + ". ";
    }
    return errorMessage;
  }
  return {
    url: data.payment_url,
  };
};

const callbackDB = async (body: any, query: any) => {
  const session = await startSession();
  session.startTransaction();

  try {
    if (body && body?.status_code === "2") {
      const verifyPaymentData = await verifyPayment(query?.txnId);

      if (verifyPaymentData && verifyPaymentData?.status_code === "2") {
        // Destructuring the necessary data
        const { approval_code, payment_type, amount, cus_phone, mer_txnid } =
          verifyPaymentData;

        // Prepare the payment data
        const paymentData = {
          userId: query?.userId,
          mer_txnid,
          cus_phone,
          amount,
          payment_type,
          approval_code,
        };

        // Update user isVerified field
        const result = await UserModel.findByIdAndUpdate(
          { _id: query?.userId },
          { isVerified: true },
          { new: true, session } // Pass the session for transaction
        ).select("_id");

        if (!result?._id) {
          throw new AppError(
            httpStatus.PRECONDITION_FAILED,
            "User isVerified update failed"
          );
        }

        // Save the payment info
        const savePaymentInfo = await PaymentInfoModel.create([paymentData], {
          session,
        });
        if (!savePaymentInfo) {
          throw new AppError(
            httpStatus.PRECONDITION_FAILED,
            "Payment info create failed"
          );
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return {
          success: true,
          txnId: query?.txnId,
        };
      }
    }

    if (body && body?.status_code === "7") {
      return {
        success: false,
      };
    }

    // If something doesn't match, abort the transaction
    await session.abortTransaction();
    session.endSession();
  } catch (error) {
    // Abort the transaction on any error
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.PRECONDITION_FAILED, "Payment Failed"); // Rethrow the error to handle it outside the function
  }
};

const myAllPaymentInfoDB = async (
  userId: string,
  queryObj: Partial<TPaymentInfo>
) => {
  const user = await UserModel.findById({ _id: userId }).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found !");
  }

  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Delete !");
  }

  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  }
  const queryPaymentInfo = new QueryBuilder2(
    PaymentInfoModel.find({ userId }).populate({
      path: "userId",
      select: "name _id email",
    }),
    queryObj
  )
    .filter()
    .fields()
    .sort()
    .paginate()
    .search(paymentInfoSearchTerm);
  const result = await queryPaymentInfo.modelQuery;
  const meta = await queryPaymentInfo.countTotal();

  return {
    result,
    meta,
  };
};
const allPaymentInfoDB = async (
  userId: string,
  queryObj: Partial<TPaymentInfo>
) => {
  const user = await UserModel.findById({ _id: userId }).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found !");
  }

  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Delete !");
  }

  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  }
  if (user?.role !== USER_ROLE.admin) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not admin !!");
  }
  const queryPaymentInfo = new QueryBuilder2(
    PaymentInfoModel.find().populate({
      path: "userId",
      select: "name _id email",
    }),
    queryObj
  )
    .filter()
    .fields()
    .sort()
    .paginate()
    .search(paymentInfoSearchTerm);
  const result = await queryPaymentInfo.modelQuery;
  const meta = await queryPaymentInfo.countTotal();

  return {
    result,
    meta,
  };
};

export const paymentService = {
  paymentDB,
  callbackDB,
  myAllPaymentInfoDB,
  allPaymentInfoDB,
};
