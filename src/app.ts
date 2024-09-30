import express, { Application, Request, Response } from "express";
import globalErrorHandler from "../src/app/Error-Handle/globalErrorHandle";
import normalMiddleware from "../src/app/middleware/normalMiddleware";
import { authRoutes } from "./app/Module/Auth/Auth.route";
import { paymentRoutes } from "./app/Module/Payment/Payment.route";
import { userProfileRoute } from "./app/Module/User-Profile/userProfile.route";


const app: Application = express();
normalMiddleware(app);

// "/api/";

app.use("/api/auth", authRoutes);
app.use("/api/user-profile", userProfileRoute);
app.use("/api/payment", paymentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Level-2 setup ");
});

app.all("*", (req: Request, res: Response, next) => {
  const error = new Error(`Can't find ${req.url} on the server`);
  next(error);
});

// global error handle
app.use(globalErrorHandler);

export default app;
