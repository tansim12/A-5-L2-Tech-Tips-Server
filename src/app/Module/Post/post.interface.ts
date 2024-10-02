import { Types } from "mongoose";

export type TReact = {
  isDelete?: boolean;
  userId: Types.ObjectId;
};

export enum TPostCategory {
  WebDevelopment = "Web Development",
  SoftwareEngineering = "Software Engineering",
  AI = "Artificial Intelligence",
  DataScience = "Data Science",
  Cybersecurity = "Cybersecurity",
  MobileAppDevelopment = "Mobile App Development",
  CloudComputing = "Cloud Computing",
  DevOps = "DevOps",
  MachineLearning = "Machine Learning",
  BlockchainTechnology = "Blockchain Technology",
}

export type TPost = {
  userId: Types.ObjectId;
  category: TPostCategory;
  description: string;
  premium: boolean;
  images?: string[];
  react?: TReact[];
  isDelete?: boolean;
  comments?: Types.ObjectId[];
};
