export interface RecruiterProfileOutput {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  subscriptionStatus: "free" | "active" | "expired";
  jobPostsUsed: number;
  joinedDate?: Date;
  companyName?: string;
  companyWebsite?: string;
  companySize?: number;
  industry?: string;
  designation?: string;
  location?: string;
  linkedinUrl?: string;
  bio?: string;
}