import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

const normalMiddleware = (app: Application) => {
  app.use(
    cors({
      origin: [
        "https://a-6-tech-tips-client-ggc5.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
       
      ],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};
export default normalMiddleware;
