export type VerificationStatus = "pending" | "verified" | "rejected";
export type SubscriptionStatus = "free" | "active" | "expired";

export class Recruiter {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly isActive: boolean;
  public readonly profileImage?: string;
  public readonly verificationStatus: VerificationStatus;
  public readonly subscriptionStatus: SubscriptionStatus;
  public readonly jobPostsUsed: number;
  public readonly joinedDate: string;
  public readonly companyName?: string;
  public readonly companyWebsite?: string;
  public readonly companySize?: number;
  public readonly industry?: string;
  public readonly designation?: string;
  public readonly location?: string;
  public readonly linkedinUrl?: string;
  public readonly bio?: string;

  constructor(params: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    profileImage?: string;
    verificationStatus: VerificationStatus;
    subscriptionStatus: SubscriptionStatus;
    jobPostsUsed: number;
    joinedDate: string;
    companyName?: string;
    companyWebsite?: string;
    companySize?: number;
    industry?: string;
    designation?: string;
    location?: string;
    linkedinUrl?: string;
    bio?: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.isActive = params.isActive;
    this.profileImage = params.profileImage;
    this.verificationStatus = params.verificationStatus;
    this.subscriptionStatus = params.subscriptionStatus;
    this.jobPostsUsed = params.jobPostsUsed;
    this.joinedDate = params.joinedDate;
    this.companyName = params.companyName;
    this.companyWebsite = params.companyWebsite;
    this.companySize = params.companySize;
    this.industry = params.industry;
    this.designation = params.designation;
    this.location = params.location;
    this.linkedinUrl = params.linkedinUrl;
    this.bio = params.bio;
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
      profileImage: this.profileImage,
      verificationStatus: this.verificationStatus,
      subscriptionStatus: this.subscriptionStatus,
      jobPostsUsed: this.jobPostsUsed,
      joinedDate: this.joinedDate,
      companyName: this.companyName,
      companyWebsite: this.companyWebsite,
      companySize: this.companySize,
      industry: this.industry,
      designation: this.designation,
      location: this.location,
      linkedinUrl: this.linkedinUrl,
      bio: this.bio,
    };
  }
}