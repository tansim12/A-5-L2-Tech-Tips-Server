import { Schema, model } from "mongoose";
import { TPaymentInfo } from "./payment.interface";

const PaymentInfoSchema = new Schema<TPaymentInfo>(
  {
    userId: { type: Schema.Types.ObjectId,  ref: "User" },
    mer_txnid: { type: String,},
    cus_email: { type: String,  },
    amount: { type: Number,  },
    payment_type: { type: String,  },
    approval_code: { type: String,  },
  },
  {
    timestamps: true, // to add createdAt and updatedAt fields
  }
);

const PaymentInfoModel = model<TPaymentInfo>("PaymentInfo", PaymentInfoSchema);

export default PaymentInfoModel;
