import { Types } from "mongoose";
import {
  findCandidateProfileByUserId,
  updateCandidateProfileByUserId,
  updateUserById,
} from "./candidate.repo";
import {
  UpdateCandidateProfileInput,
  UpdateUserProfileInput,
} from "./candidate.types";
import { UserModel } from "../auth/infrastructure/mongoose/model/user.model";
import { comparePassword, hashPassword } from "../utils/hash";



export const getCandidateProfileService = async (userId: string) => {
  const profile = await findCandidateProfileByUserId(userId);
  if (!profile) throw new Error("Candidate profile not found");
  return profile;
};



export const updateCandidateProfileService = async (
  userId: string,
  data: UpdateCandidateProfileInput & UpdateUserProfileInput
) => {
  const { fullName, profileImage, ...candidateData } = data;

  if (fullName || profileImage) {
    await updateUserById(userId, {
      ...(fullName && { fullName }),
      ...(profileImage && { profileImage }),
    });
  }

  const profile = await updateCandidateProfileByUserId(
    userId,
    candidateData
  );

  if (!profile) throw new Error("Candidate profile not found");

  return profile;
};



export const updateUserPasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  if (user.authProvider !== "local") {
    throw new Error("Password update not allowed for social login");
  }

  const isMatch = await comparePassword(currentPassword, user.password!);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const isSamePassword = await comparePassword(newPassword, user.password!);
  if (isSamePassword) {
    throw new Error("New password must be different from old password");
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  return true;
};

