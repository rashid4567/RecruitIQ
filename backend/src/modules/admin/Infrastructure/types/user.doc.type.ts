import { Types } from "mongoose";

export type userDoc = {
  _id: Types.ObjectId;
  email: string;
  isActive: boolean;
};