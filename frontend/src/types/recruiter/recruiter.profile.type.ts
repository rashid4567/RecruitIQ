// INPUT DTO (form + update)
export interface RecruiterProfileData {
  fullName?: string;
  profileImage?: string;
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  location?: string;
  bio?: string;
  designation?: string;
}

// OUTPUT DTO (API response)
export interface RecruiterProfileResponse {
  _id: string;
  userId: string;

  fullName?: string;
  profileImage?: string;
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  location?: string;
  bio?: string;
  designation?: string;

  subscriptionStatus?: "free" | "active" | "expired";
  verificationStatus?: "pending" | "verified" | "rejected";
  jobPostsUsed?: number;

  createdAt?: string;
  updatedAt?: string;
}
