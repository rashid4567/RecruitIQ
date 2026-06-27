export type VerificationStatus =
  | "pending"
  | "verified"
  | "rejected";

export type SubscriptionStatus =
  | "free"
  | "active"
  | "expired";

export interface RecruiterListItem {
  id: string;
  name: string;
  email: string;

  isActive: boolean;
  profileImage?: string;

  verificationStatus: VerificationStatus;
  subscriptionStatus: SubscriptionStatus;

  jobPostsUsed: number;
  joinedDate?: string;

  companyName?: string;
  companyWebsite?: string;
  companySize?: number;
  industry?: string;
  designation?: string;
  
  location?: string;
  linkedinUrl?: string;
  bio?: string;
}

export interface RecruiterListResponse {
  recruiters: RecruiterListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface RecruiterProfile extends RecruiterListItem {}

export interface RecruiterQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  verificationStatus?: VerificationStatus;
  subscriptionStatus?: SubscriptionStatus;
  isActive?: boolean;
  sort?: "latest" | "oldest";
}