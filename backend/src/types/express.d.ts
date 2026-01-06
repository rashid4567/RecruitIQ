import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: "admin" | "recruiter" | "candidate";
      };
    }
  }
}

export {};
