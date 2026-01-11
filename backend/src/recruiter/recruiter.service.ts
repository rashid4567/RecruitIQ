// src/recruiter/recruiter.service.ts
import {
  findRecruiterProfileByUser,
  createRecruiterProfileIfNotExists,
  updateRecruiterProfileByUserId,
} from "./recruiter.repo";
import { UpdateRecruiterProfileInput } from "./candidate.types";

/**
 * Get recruiter profile (auto-create if missing)
 */
export const getRecruiterProfileService = async (userId: string) => {
  let profile = await findRecruiterProfileByUser(userId);

  if (!profile) {
    profile = await createRecruiterProfileIfNotExists(userId);
  }

  return profile;
};

/**
 * Update recruiter profile (used by BOTH:
 * - complete-profile page
 * - normal profile page)
 */
export const updateRecruiterProfileService = async (
  userId: string,
  data: UpdateRecruiterProfileInput
) => {
  const profile = await updateRecruiterProfileByUserId(userId, data);

  if (!profile) {
    throw new Error("Recruiter profile not found");
  }

  return profile;
};
