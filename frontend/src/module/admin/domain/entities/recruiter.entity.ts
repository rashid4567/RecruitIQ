export type VerificationStatus = "pending" | "verified" | "rejected";
export type SubscriptionStatus = "free" | "active" | "expired";

export class Recruiter {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly isActive: boolean;
  public readonly companyName ?: string;
  public readonly verificationStatus: VerificationStatus;
  public readonly subscriptionStatus: SubscriptionStatus;
  public readonly jobPostsUsed: number;
  public readonly joinedDate: string;


  constructor(params: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    companyName ?: string;
    verificationStatus: VerificationStatus;
    subscriptionStatus: SubscriptionStatus;
    jobPostsUsed: number;
    joinedDate: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.isActive = params.isActive;
    this.companyName = params.companyName;
    this.verificationStatus = params.verificationStatus;
    this.subscriptionStatus = params.subscriptionStatus;
    this.jobPostsUsed = params.jobPostsUsed;
    this.joinedDate = params.joinedDate;
  }

  isBlocked(): boolean {
    return !this.isActive;
  }

  isVerified(): boolean {
    return this.verificationStatus === "verified";
  }

  withVerificationStatus(status: VerificationStatus): Recruiter {
    return new Recruiter({ ...this.toPrimitives(), verificationStatus: status });
  }

  withActiveStatus(isActive: boolean): Recruiter {
    return new Recruiter({ ...this.toPrimitives(), isActive });
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      isActive: this.isActive,
      companyName: this.companyName,
      verificationStatus: this.verificationStatus,
      subscriptionStatus: this.subscriptionStatus,
      jobPostsUsed: this.jobPostsUsed,
      joinedDate: this.joinedDate,
    };
  }
}