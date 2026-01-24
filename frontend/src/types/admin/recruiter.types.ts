export type VerificationStatus = "pending" | "verified" | "rejected";
export type SubscriptionStatus = "free" | "active" | "expired";

export interface Recruiter {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;

  verificationStatus: VerificationStatus;
  subscriptionStatus: SubscriptionStatus;
  jobPostsUsed: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface RecruiterListResponse {
  recruiters: Recruiter[];
  pagination: Pagination;
}

export interface RecruiterQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  verificationStatus?: VerificationStatus;
  subscriptionStatus?: SubscriptionStatus;
  isActive?: boolean;
  sort?: "latest" | "oldest";
}

export interface RecruiterProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  phone?: string;
  isActive: boolean;
  verificationStatus: VerificationStatus;

  company?: string;
  bio?: string;
  location?: string;
  timezone?: string;

  joinedDate: string;
  lastActive?: string;

  subscription: {
    plan: SubscriptionStatus;
    status: string;
  };

  quickStats: {
    jobsPosted: number;
    interviewsScheduled: number;
    candidatesContacted: number;
  };

  rating?: number;
  reviewCount?: number;
}
