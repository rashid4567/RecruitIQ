export interface RecruiterProfileData {
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  location?: string;
  bio?: string;
  designation?: string;
}

export interface RecruiterProfileResponse {
  _id: string;
  userId: string;
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  location?: string;
  bio?: string;
  designation?: string;
  subscriptionStatus: "free" | "active" | "expired";
  verificationStatus: "pending" | "verified" | "rejected";
  jobPostsUsed: number;
  createdAt: string;
  updatedAt: string;
}
