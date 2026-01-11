import {
  findCandidateProfileByUserId,
  updateCandidateProfileByUserId,
} from "./candidate.repo";
import { UpdateCandidateProfileInput } from "./candidate.types";

export const getCandidateProfileService = async (userId: string) => {
  const profile = await findCandidateProfileByUserId(userId);
  if (!profile) throw new Error("Candidate profile not found");
  return profile;
};

export const updateCandidateProfileService = async (
  userId: string,
  data: UpdateCandidateProfileInput
) => {
  const profile = await updateCandidateProfileByUserId(userId, data);
  if (!profile) throw new Error("Candidate profile not found");
  return profile;
};
