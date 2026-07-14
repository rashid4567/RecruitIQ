import api from "@/api/axios";
import { RECRUITER_PROFILE_ROUTES } from "../constants/recruiter-profile.routes";
import type {
  RecruiterProfile,
  RecruiterProfileResponse,
  UpdateRecruiterProfileDTO,
  CompleteRecruiterProfileDTO,
} from "../types/recruiter.types";
import { mapRecruiterProfile } from "../mapper/mapRecruiterProfile";

export const getRecruiterProfile = async (): Promise<RecruiterProfile> => {
  const { data } = await api.get<{
    data: RecruiterProfileResponse;
  }>(RECRUITER_PROFILE_ROUTES.PROFILE);

  return mapRecruiterProfile(data.data);
};

export const updateRecruiterProfile = async (
  payload: UpdateRecruiterProfileDTO,
): Promise<RecruiterProfile> => {
  const { data } = await api.put<{
    data: RecruiterProfileResponse;
  }>(RECRUITER_PROFILE_ROUTES.PROFILE, payload);

  return mapRecruiterProfile(data.data);
};

export const completeRecruiterProfile = async (
  payload: CompleteRecruiterProfileDTO,
): Promise<void> => {
  await api.put(RECRUITER_PROFILE_ROUTES.COMPLETE_PROFILE, payload);
};
