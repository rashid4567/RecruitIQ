// src/candidate/candidate.repo.ts
import { candidateProfileModel } from "./candidateProfile.model";
import { UpdateCandidateProfileInput } from "./candidate.types";

export const findCandidateProfileByUserId = (userId: string) => {
  return candidateProfileModel.findOne({ userId });
};

export const updateCandidateProfileByUserId = (
  userId: string,
  data: UpdateCandidateProfileInput
) => {
   

  return candidateProfileModel.findOneAndUpdate(
    { userId },
    {
      ...data,
      profileCompleted: true,
    },
    { new: true,
      runValidators : true,
     }
  );
};
