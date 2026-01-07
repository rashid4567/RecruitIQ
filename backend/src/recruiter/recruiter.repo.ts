import { RecruiterProfileModel } from "./recruiterProfile.model";
import { UpdateRecruiterProfileInput } from "./candidate.types";


export const findRecruiterProfileByUser = (userId: string) => {
  return RecruiterProfileModel.find({ userId });
};
export const updateRecruiterProfileById = (
  userId: string,
  data: UpdateRecruiterProfileInput
) => {
  return RecruiterProfileModel.findOneAndUpdate(
    { userId },
    {
      ...data,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};
