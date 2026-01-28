export interface RecruiterProfileData {
  fullName?: string;
  profileImage?: string;
  companyName?: string;
  companyWebsite?: string;
  companySize?: number;
  industry?: string;
  location?: string;
  bio?: string;
  designation?: string;
}


export interface RecruiterProfileResponse {
  user: {
    id: string;
    fullName?: string;
    email?: string;
    profileImage?: string;
  };

  recruiter: {
    companyName?: string;
    companyWebsite?: string;
    companySize?: number;
    industry?: string;
    location?: string;
    bio?: string;
    designation?: string;

    subscriptionStatus?: "free" | "active" | "expired";
    verificationStatus?: "pending" | "verified" | "rejected";
    jobPostsUsed?: number;

    createdAt?: string;
    updatedAt?: string;
  };
}

