import { subscribtionStatus } from "../constatns/subscribtionStatus.contsants";
import { verificationStatus } from "../constatns/verificationStatus.constants";
import { UserId } from "../../../../shared/domain/value-objects.ts/userId.vo";

export class RecruiterProfile {
  private constructor(
    private readonly userId: UserId,
    private companyName?: string,
    private companyWebsite?: string,
    private companySize?: number,
    private industry?: string,
    private designation?: string,
    private bio?: string,
    private linkedinUrl?: string,
    private location?: string,
    private subscriptionStatus?: subscribtionStatus,
    private jobPostsUsed?: number,
    private verificationStatus?: verificationStatus,
  ) {}

  public static create(
    userId: UserId,
    companyName: string,
    companyWebsite: string,
  ): RecruiterProfile {
    if (!companyName || companyName.trim().length === 0) {
      throw new Error("Company name is required");
    }
    if (!companyWebsite) {
      throw new Error("Company website should be there");
    }
    return new RecruiterProfile(userId, companyName, companyWebsite);
  }

  public static fromPresistence(props: {
    userId: UserId;
    companyName: string;
    companyWebsite?: string;
    companySize?: number;
    industry?: string;
    designation?: string;
    bio?: string;
    linkedinUrl?: string;
    location?: string;
    subscriptionStatus: subscribtionStatus;
    jobPostsUsed: number;
    verificationStatus: verificationStatus;
  }): RecruiterProfile {
    return new RecruiterProfile(
      props.userId,
      props.companyName,
      props.companyWebsite,
      props.companySize,
      props.industry,
      props.designation,
      props.bio,
      props.linkedinUrl,
      props.location,
      props.subscriptionStatus,
      props.jobPostsUsed,
      props.verificationStatus,
    );
  }

  public updateCompanyName(name: string): void {
    this.companyName = name;
  }

  public updateCompanyWebsite(url: string): void {
    this.companyWebsite = url;
  }

  public updateIndustry(value: string): void {
    this.industry = value;
  }

  public updateCompanySize(size: number): void {
    if (!size || size < 0) {
      throw new Error("Company size will not be negative");
    }
    this.companySize = size;
  }

  public updateDesignation(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error("Designation should not be empty");
    }

    this.designation = value;
  }

  public updateBio(value: string): void {
    this.bio = value;
  }

  public updateLinkedinUrl(value: string): void {
    this.linkedinUrl = value;
  }

  public updateLocation(value: string): void {
    this.location = value;
  }

  public getCompanyName(): string | undefined {
    return this.companyName;
  }

  public getCompanyWebsite(): string | undefined {
    return this.companyWebsite;
  }

  public getIndustry(): string | undefined {
    return this.industry;
  }

  public getCompanySize(): number | undefined {
    return this.companySize;
  }

  public getDesignation(): string | undefined {
    return this.designation;
  }

  public getBio(): string | undefined {
    return this.bio;
  }

  public getLinkedinUrl(): string | undefined {
    return this.linkedinUrl;
  }

  public getLocation(): string | undefined {
    return this.location;
  }
  public getSubscriptionStatus(): subscribtionStatus | undefined {
    return this.subscriptionStatus;
  }

  public getUserId(): UserId {
    return this.userId;
  }
  getJobPostsUsed(): number | undefined {
    return this.jobPostsUsed;
  }

  public getVerificationStatus(): verificationStatus | undefined {
    return this.verificationStatus;
  }
}
