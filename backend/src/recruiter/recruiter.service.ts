import { UpdateRecruiterProfileInput } from "./candidate.types";

import {
  findRecruiterProfileByUser,
  updateRecruiterProfileById,
} from "./recruiter.repo";

export const getRecruiterProfileService = async (userId: string) => {
  const profile = await findRecruiterProfileByUser(userId);
  if (!profile) {
    throw new Error("Recruiter profile not found");
  }
  return profile;
};
export const updateRecruiterProfileService = async (
  userId: string,
  data: UpdateRecruiterProfileInput
) => {
  const profile = await updateRecruiterProfileById(userId, data);
  if (!profile) {
    throw new Error("Recruiter profile not found");
  }
  return profile;
};
