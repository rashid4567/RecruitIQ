export interface RecruiterRepository {
  getRecruiters(input: {
    search?: string;
    verificationStatus?: "pending" | "verified" | "rejected";
    subscriptionStatus?: string;
    isActive?: boolean;
    skip: number;
    limit: number;
    sort?: "latest" | "oldest";
  }): Promise<{ recruiters: any[]; total: number }>;

  getRecruiterProfile(recruiterId: string): Promise<any | null>;

  updateActiveStatus(
    recruiterId: string,
    isActive: boolean
  ): Promise<void>;

  verifyRecruiter(
    recruiterId: string,
    status: "pending" | "verified" | "rejected"
  ): Promise<any>;
}
