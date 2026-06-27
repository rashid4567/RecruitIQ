import api from "@/api/axios";

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
  }>("/recruiter/profile");

  return mapRecruiterProfile(data.data);
};

export const updateRecruiterProfile = async (
  payload: UpdateRecruiterProfileDTO,
): Promise<RecruiterProfile> => {
  const { data } = await api.put<{
    data: RecruiterProfileResponse;
  }>("/recruiter/profile", payload);

  return mapRecruiterProfile(data.data);
};

export const completeRecruiterProfile = async (
  payload: CompleteRecruiterProfileDTO,
): Promise<void> => {
  await api.put("/recruiter/complete-profile", payload);
};