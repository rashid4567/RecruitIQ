import api from "../../api/axios";
import type {
  RecruiterQueryParams,
  RecruiterListResponse,
  RecruiterProfile,
  VerificationStatus,
} from "../../types/admin/recruiter.types";

export const adminRecruiterService = {
  getRecruiters: async (
    params: RecruiterQueryParams
  ): Promise<RecruiterListResponse> => {
    const res = await api.get("/admin/recruiters", { params });
    return res.data.data;
  },

  getRecruiterProfile: async (
    recruiterId: string
  ): Promise<RecruiterProfile> => {
    const res = await api.get(`/admin/recruiters/${recruiterId}`);
    return res.data.data;
  },

  verifyRecruiter: async (recruiterId: string, status: VerificationStatus) => {
    const res = await api.patch(`/admin/recruiters/${recruiterId}/verify`, {
      status,
    });
    return res.data;
  },

  updateRecruiterStatus: async (recruiterId: string, isActive: boolean) => {
    const res = await api.patch(`/admin/recruiters/${recruiterId}/status`, {
      isActive,
    });
    return res.data;
  },
};
