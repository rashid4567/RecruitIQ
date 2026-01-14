import { Types } from "mongoose";
import { UserModel } from "../../auth/infrastructure/mongoose/model/user.model";
import { RecruiterProfileModel } from "../../recruiter/recruiterProfile.model";
import { VerificationStatus } from "./recruiter.types";

export const aggregateRecruiters = async (pipeline: any[]) => {
  try {
    return await UserModel.aggregate(pipeline);
  } catch (err) {
    console.error(
      "❌ Recruiter aggregation failed:\n",
      JSON.stringify(pipeline, null, 2)
    );
    throw err;
  }
};

export const findRecruiterById = async (userId: string) => {
  return UserModel.findOne({
    _id: new Types.ObjectId(userId),
    role: "recruiter",
  });
};

export const updateRecruiterActiveStatus = async (
  userId: string,
  isActive: boolean
) => {
  return UserModel.findByIdAndUpdate(
    new Types.ObjectId(userId),
    { isActive },
    { new: true }
  );
};

export const updateRecruiterVerification = async (
  userId: string,
  status: VerificationStatus
) => {
  return RecruiterProfileModel.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { verificationStatus: status },
    { new: true }
  );
};

export const createRecruiterProfile = async (
  userId: string,
  companyName: string,
  status: VerificationStatus
) => {
  return RecruiterProfileModel.create({
    userId: new Types.ObjectId(userId),
    companyName,
    verificationStatus: status,
    subscriptionStatus: "free",
    jobPostsUsed: 0,
  });
};

export const findRecruiterProfile = async (userId: Types.ObjectId) => {
  return RecruiterProfileModel.findOne({ userId }).lean();
};
