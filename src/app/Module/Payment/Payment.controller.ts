import { RequestHandler } from "express";
import { paymentService } from "./Payment.service";
import { successResponse } from "../../Re-Useable/CustomResponse";
import dotenv from "dotenv";
dotenv.config();

const payment: RequestHandler = async (req, res, next) => {
  try {
    const result = await paymentService.paymentDB(req.body, req.user?.id);
    res.send(successResponse(result, 200, "Payment ongoing ..."));
  } catch (error) {
    next(error);
  }
};
const callback: RequestHandler = async (req, res, next) => {
  try {
    const result = await paymentService.callbackDB(req.body, req?.query);
    if (result?.success) {
      res.redirect(
        // `${process.env.FRONTEND_URL}payment-success?bookingId=${result?.bookingId}`
        //! todo should be dynamic transaction id
        `${process.env.FRONTEND_URL}/payment-success?bookingId=${result?.txnId}`
      );
    }
    if (result?.success === false) {
      res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }
  } catch (error) {
    next(error);
  }
};

const myAllPaymentInfo: RequestHandler = async (req, res, next) => {
  try {
    const result = await paymentService.myAllPaymentInfoDB(
      req.user?.id,
      req?.query
    );
    res.send(successResponse(result, 200, "My Payment Info find done"));
  } catch (error) {
    next(error);
  }
};

export const paymentController = {
  payment,
  callback,
  myAllPaymentInfo,
};
