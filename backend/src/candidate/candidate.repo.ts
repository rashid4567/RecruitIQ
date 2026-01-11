// src/candidate/candidate.repo.ts
import { candidateProfileModel } from "./candidateProfile.model";
import { UpdateCandidateProfileInput } from "./candidate.types";
import { UserModel } from "../user/user.model";

export const findCandidateProfileByUserId =async (userId: string) => {
  const user = await UserModel.findById(userId).select(
    "fullName email profileImage"
  );

  if(!user)return null;

  let candidateProfile = await candidateProfileModel.findOne({userId})

  if(!candidateProfile){
    candidateProfile = await candidateProfileModel.create({
      userId
    })
  }

  return {
    user,
    candidateProfile,
  }
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
      upsert: true,
     }
  );
};
