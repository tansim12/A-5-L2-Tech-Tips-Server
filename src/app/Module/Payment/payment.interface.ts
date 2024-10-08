import { Types } from "mongoose";

export type TPaymentInfo = {
  userId: Types.ObjectId;
  mer_txnid: string;
  cus_email: string;
  cus_phone: string;
  amount: number;
  payment_type: string;
  approval_code: string;
};
