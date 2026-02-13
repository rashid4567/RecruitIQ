export interface RecruiterProfileOutput {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  company: string;
  subscriptionStatus: string;
  jobPostsUsed: number;
  joinedDate: Date;
}
