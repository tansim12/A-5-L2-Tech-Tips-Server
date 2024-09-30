import mongoose from "mongoose";
import dotEnv from "dotenv";
dotEnv.config();
const dbConnect = async () => {
  try {
    await mongoose
      .connect(process.env.DATABASE_URL  as string, { dbName: process.env.DB_NAME })
      .then(() => {
        console.log("connect by setup mongoose");
      });
  } catch (error: unknown) {
    console.log(error);
  }
};

export default dbConnect;
