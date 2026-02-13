export type VerificationStatus = "pending" | "verified" | "rejected";
export type SubscriptionStatus = "free" | "active" | "expired";

export class Recruiter {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly isActive: boolean;
  public readonly profileImage?: string;
  public readonly verificationStatus: VerificationStatus;
  public readonly companyName?: string;
  public readonly subscriptionStatus: SubscriptionStatus;
  public readonly jobPostsUsed: number;
  public readonly joinedDate: string;
  public readonly location?: string;
  public readonly bio?: string;

  constructor(params: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    profileImage?: string;
    verificationStatus: VerificationStatus;
    companyName?: string;
    subscriptionStatus: SubscriptionStatus;
    jobPostsUsed: number;
    joinedDate: string;
    location?: string;
    bio?: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.isActive = params.isActive;
    this.profileImage = params.profileImage;
    this.verificationStatus = params.verificationStatus;
    this.companyName = params.companyName;
    this.subscriptionStatus = params.subscriptionStatus;
    this.jobPostsUsed = params.jobPostsUsed;
    this.joinedDate = params.joinedDate;
    this.location = params.location;
    this.bio = params.bio;
  }

  isBlocked(): boolean {
    return !this.isActive;
  }

  isVerified(): boolean {
    return this.verificationStatus === "verified";
  }

  withVerificationStatus(status: VerificationStatus): Recruiter {
    return new Recruiter({
      ...this.toPrimitives(),
      verificationStatus: status,
    });
  }

  withActiveStatus(isActive: boolean): Recruiter {
    return new Recruiter({
      ...this.toPrimitives(),
      isActive,
    });
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      isActive: this.isActive,
      profileImage: this.profileImage,
      verificationStatus: this.verificationStatus,
      companyName: this.companyName,
      subscriptionStatus: this.subscriptionStatus,
      jobPostsUsed: this.jobPostsUsed,
      joinedDate: this.joinedDate,
      location: this.location,
      bio: this.bio,
    };
  }
}
