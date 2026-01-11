import { RecruiterProfileModel } from "./recruiterProfile.model";
import { UpdateRecruiterProfileInput } from "./candidate.types";

export const findRecruiterProfileByUser = (userId: string) => {
  return RecruiterProfileModel.findOne({ userId });
};

export const createRecruiterProfileIfNotExists  = async (userId: string) => {
  const existig = await RecruiterProfileModel.findOne({ userId });
  if (existig) return existig;
  return RecruiterProfileModel.create({ userId });
};
export const updateRecruiterProfileByUserId = (
  userId: string,
  data: UpdateRecruiterProfileInput
) => {
  return RecruiterProfileModel.findOneAndUpdate(
    { userId },
    { $set: data },
    { new: true, runValidators: true }
  );
};
