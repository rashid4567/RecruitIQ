import { UserModel } from "../user/user.model";
import { RecruiterProfileModel } from "../recruiter/recruiterProfile.model";
import { candidateProfileModel } from "../candidate/candidateProfile.model";
import { CreateUserInput } from "./auth.types";

export const findUserByEmail = async (email: string) => {
  return UserModel.findOne({ email });
};

export const createUser = async (data: CreateUserInput) => {
  return UserModel.create(data);
};

export const createRecruiterProfile = async (
  userId: string,
  data?: {
    companyName?: string;
    verificationStatus?: "pending" | "verified" | "rejected";
    subscriptionStatus?: "free" | "active" | "expired";
  }
) => {
  return RecruiterProfileModel.create({
    userId,
    ...data,
  });
};


export const createCandidateProfile = async (userId: string) => {
  return candidateProfileModel.create({ userId });
};
