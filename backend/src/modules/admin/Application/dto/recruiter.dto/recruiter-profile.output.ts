export interface RecruiterProfileOutput {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  companyName: string;
  companyWebsite: string;
  subscriptionStatus: string;
  jobPostsUsed: number;
  joinedDate: Date;

  companySize?: number;
  industry?: string;
  designation?: string;
  location?: string;
  linkedinUrl?: string;
  bio?: string;
}