import { DOMAIN_ERROR_CODES } from "../../../../shared/constants/domain.error.code";
import { DomainError } from "../../../../shared/errors/domain.error";

export type VerificationStatus = "pending" | "verified" | "rejected";

export type SubscriptionStatus = "free" | "active" | "expired";

export interface RecruiterProps {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  profileImage?: string;
  verificationStatus: VerificationStatus;
  subscriptionStatus?: SubscriptionStatus;
  jobPostsUsed?: number;
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

export class Recruiter {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly isActive: boolean,
    public readonly profileImage: string | undefined,
    public readonly verificationStatus: VerificationStatus,
    public readonly subscriptionStatus?: SubscriptionStatus,
    public readonly jobPostsUsed?: number,
    public readonly joinedDate?: Date,
    public readonly companyName?: string,
    public readonly companyWebsite?: string,
    public readonly companySize?: number,
    public readonly industry?: string,
    public readonly designation?: string,
    public readonly location?: string,
    public readonly linkedinUrl?: string,
    public readonly bio?: string,
  ) {}

  static fromPersistence(props: RecruiterProps): Recruiter {
    return new Recruiter(
      props.id,
      props.name,
      props.email,
      props.isActive,
      props.profileImage,
      props.verificationStatus,
      props.subscriptionStatus,
      props.jobPostsUsed,
      props.joinedDate,
      props.companyName,
      props.companyWebsite,
      props.companySize,
      props.industry,
      props.designation,
      props.location,
      props.linkedinUrl,
      props.bio,
    );
  }

  canBeVerified(): boolean {
    return this.verificationStatus === "pending";
  }

  canBeRejected(): boolean {
    return this.verificationStatus === "pending";
  }

  canBeActivated(): boolean {
    return !this.isActive;
  }

  verify(): Recruiter {
    if (!this.canBeVerified()) {
      throw new DomainError(DOMAIN_ERROR_CODES.RECRUITER_CANNOT_BE_VERIFIED);
    }

    return Recruiter.fromPersistence({
      ...this.toProps(),
      verificationStatus: "verified",
    });
  }

  reject(): Recruiter {
    if (!this.canBeRejected()) {
      throw new DomainError(DOMAIN_ERROR_CODES.RECRUITER_CANNOT_BE_REJECTED);
    }

    return Recruiter.fromPersistence({
      ...this.toProps(),
      verificationStatus: "rejected",
    });
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getProfileImage(): string | undefined {
    return this.profileImage;
  }

  getVerificationStatus(): VerificationStatus {
    return this.verificationStatus;
  }

  isRecruiterActive(): boolean {
    return this.isActive;
  }

  private toProps(): RecruiterProps {
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
