
import {
  findRecruiterProfileByUser,
  createRecruiterProfileIfNotExists,
  updateRecruiterProfileByUserId,
} from "./recruiter.repo";
import { UpdateRecruiterProfileInput, UpdateUserProfileInput } from "./recruiter.types";
import { UserModel } from "../../modules/auth/infrastructure/mongoose/model/user.model";
import { comparePassword, hashPassword } from "../../utils/hash";
import { updateUserById } from "../candidate/candidate.repo";


export const getRecruiterProfileService = async (userId: string) => {
  let profile = await findRecruiterProfileByUser(userId);

  if (!profile) {
    profile = await createRecruiterProfileIfNotExists(userId);
  }

  return profile;
};


export const updateRecruiterProfileService = async (
  userId: string,
  data: UpdateRecruiterProfileInput & UpdateUserProfileInput
) => {
  const { fullName, profileImage, ...recruiterData } = data;

  const userUpdateData: Partial<UpdateUserProfileInput> = {};

  if (fullName !== undefined) {
    userUpdateData.fullName = fullName;
  }

  if (profileImage !== undefined) {
    userUpdateData.profileImage = profileImage;
  }

  if (Object.keys(userUpdateData).length > 0) {
    await updateUserById(userId, userUpdateData);
  }

  const profile = await updateRecruiterProfileByUserId(
    userId,
    recruiterData
  );

  if (!profile) {
    throw new Error("Recruiter profile not found");
  }

  return profile;
};



export const updateRecruiterPasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "recruiter") {
    throw new Error("Unauthorized role");
  }

  if (user.authProvider !== "local") {
    throw new Error("Password update not allowed for social login");
  }

  const isMatch = await comparePassword(
    currentPassword,
    user.password!
  );

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const isSamePassword = await comparePassword(
    newPassword,
    user.password!
  );

  if (isSamePassword) {
    throw new Error("New password must be different from old password");
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  return true;
};