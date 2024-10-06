import { Types } from "mongoose";

export type TReact = {
  isDelete?: boolean;
  userId: Types.ObjectId;
};

export enum TPostCategory {
  WebDevelopment = "WebDevelopment",
  SoftwareEngineering = "SoftwareEngineering",
  AI = "ArtificialIntelligence",
  DataScience = "DataScience",
  Cybersecurity = "Cybersecurity",
  MobileAppDevelopment = "MobileAppDevelopment",
  CloudComputing = "CloudComputing",
  DevOps = "DevOps",
  MachineLearning = "MachineLearning",
  BlockchainTechnology = "BlockchainTechnology",
}


export type TPost = {
  title: string;
  userId?: Types.ObjectId;
  category: TPostCategory;
  description: string;
  premium: boolean;
  images?: string[];
  react?: TReact[];
  isDelete?: boolean;
  comments?: Types.ObjectId[];
};
