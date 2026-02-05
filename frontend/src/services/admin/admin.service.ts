import api from "../../api/axios";


/* -------------------------------------------------------------------------- */
/*                               CANDIDATE TYPES                               */
/* -------------------------------------------------------------------------- */

export type CandidateStatus = "Active" | "Blocked";

export interface CandidateListItem {
  id: string;
  name: string;
  email: string;
  status: CandidateStatus;
  registeredDate: string;
}

export interface CandidateListResponse {
  candidates: CandidateListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface GetCandidatesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "All" | CandidateStatus;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  status: CandidateStatus;
  registeredDate: string;
  lastActive: string;
  summary: string;
  skills: string[];
}

/* -------------------------------------------------------------------------- */
/*                               RECRUITER TYPES                               */
/* -------------------------------------------------------------------------- */

export type VerificationStatus = "pending" | "verified" | "rejected";
export type SubscriptionStatus = "free" | "active" | "expired";

export interface RecruiterListItem {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  verificationStatus: VerificationStatus;
  subscriptionStatus: SubscriptionStatus;
  jobPostsUsed: number;
  joinedDate: string;
}

export interface RecruiterListResponse {
  recruiters: RecruiterListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface RecruiterQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  verificationStatus?: VerificationStatus;
  subscriptionStatus?: SubscriptionStatus;
  sort?: "latest" | "oldest";
}

export interface RecruiterProfile {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  verificationStatus: VerificationStatus;
  joinedDate: string;
}

/* -------------------------------------------------------------------------- */
/*                             ADMIN SERVICE API                               */
/* -------------------------------------------------------------------------- */

export const adminService = {
  /* ============================== CANDIDATES ============================== */

  async getCandidates(
    params: GetCandidatesParams
  ): Promise<CandidateListResponse> {
    const { data } = await api.get("/admin/candidates", { params });
    return data.data;
  },

  async getCandidateProfile(
    candidateId: string
  ): Promise<CandidateProfile> {
    const { data } = await api.get(`/admin/candidates/${candidateId}`);
    return data.data;
  },

  async blockCandidate(candidateId: string): Promise<void> {
    await api.patch(`/admin/candidates/${candidateId}/block`);
  },

  async unblockCandidate(candidateId: string): Promise<void> {
    await api.patch(`/admin/candidates/${candidateId}/unblock`);
  },

  /* ============================== RECRUITERS =============================== */

  async getRecruiters(
    params: RecruiterQueryParams
  ): Promise<RecruiterListResponse> {
    const { data } = await api.get("/admin/recruiters", { params });
    return data.data;
  },

  async getRecruiterProfile(
    recruiterId: string
  ): Promise<RecruiterProfile> {
    const { data } = await api.get(`/admin/recruiters/${recruiterId}`);
    return data.data;
  },

  async blockRecruiter(recruiterId: string): Promise<void> {
    await api.patch(`/admin/recruiters/${recruiterId}/block`);
  },

  async unblockRecruiter(recruiterId: string): Promise<void> {
    await api.patch(`/admin/recruiters/${recruiterId}/unblock`);
  },

  async verifyRecruiter(recruiterId: string): Promise<void> {
    await api.patch(`/admin/recruiters/${recruiterId}/verify`);
  },

  async rejectRecruiter(recruiterId: string): Promise<void> {
    await api.patch(`/admin/recruiters/${recruiterId}/reject`);
  },
};
