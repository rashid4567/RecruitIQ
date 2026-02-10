import { Types } from "mongoose";

export type CandidateRow = {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  isActive: boolean;
};