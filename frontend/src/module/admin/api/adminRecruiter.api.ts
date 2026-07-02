import api from "@/api/axios";

import { RECRUITER_ROUTES } from "../constant/recruiter.routes";
import type {
  RecruiterListResponse,
  RecruiterQueryParams,
  RecruiterProfile,
} from "../types/recruiter.types";

export const getRecruiters = async (
  params: RecruiterQueryParams,
): Promise<RecruiterListResponse> => {
  const { data } = await api.get(
    RECRUITER_ROUTES.GET_RECRUITERS,
    {
      params,
    },
  );

  return data.data;
};

export const getRecruiterProfile = async (
  recruiterId: string,
): Promise<RecruiterProfile> => {
  const { data } = await api.get(
    RECRUITER_ROUTES.GET_RECRUITER_PROFILE(recruiterId),
  );

  return data.data;
};

export const verifyRecruiter = async (
  recruiterId: string,
): Promise<void> => {
  await api.patch(
    RECRUITER_ROUTES.VERIFY_RECRUITER(recruiterId),
  );
};

export const rejectRecruiter = async (
  recruiterId: string,
): Promise<void> => {
  await api.patch(
    RECRUITER_ROUTES.REJECT_RECRUITER(recruiterId),
  );
};

export const toggleRecruiterStatus = async (
  recruiterId: string,
  isActive: boolean,
): Promise<void> => {
  await api.patch(
    RECRUITER_ROUTES.TOGGLE_RECRUITER_STATUS(recruiterId),
    { isActive },
  );
};