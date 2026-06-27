import api from "@/api/axios";

import type {
  RecruiterListResponse,
  RecruiterQueryParams,
  RecruiterProfile,
} from "../types/recruiter.types";

export const getRecruiters = async (
  params: RecruiterQueryParams,
): Promise<RecruiterListResponse> => {
  const { data } = await api.get("/admin/recruiters", {
    params,
  });

  return data.data;
};

export const getRecruiterProfile = async (
  recruiterId: string,
): Promise<RecruiterProfile> => {
  const { data } = await api.get(
    `/admin/recruiters/${recruiterId}`,
  );

  return data.data;
};

export const verifyRecruiter = async (
  recruiterId: string,
): Promise<void> => {
  await api.patch(`/admin/recruiters/${recruiterId}/verify`);
};

export const rejectRecruiter = async (
  recruiterId: string,
): Promise<void> => {
  await api.patch(`/admin/recruiters/${recruiterId}/reject`);
};

export const toggleRecruiterStatus = async (
  recruiterId: string,
  isActive: boolean,
): Promise<void> => {
  await api.patch(
    `/admin/recruiters/${recruiterId}/status`,
    { isActive },
  );
};