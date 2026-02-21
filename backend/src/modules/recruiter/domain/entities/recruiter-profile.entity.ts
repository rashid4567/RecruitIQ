import { subscribtionStatus } from "../constatns/subscribtionStatus.contsants";
import { verificationStatus } from "../constatns/verificationStatus.constants";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { DomainError } from "../../../../shared/errors/domain.error";
import { ERROR_CODES } from "../constatns/recruiter.profile.error";

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
    private subscriptionStatus: subscribtionStatus = "free",
    private jobPostsUsed: number = 0,
    private verificationStatus: verificationStatus = "pending",
  ) {}

  public static create(
    userId: UserId,
    companyName: string,
    companyWebsite: string,
  ): RecruiterProfile {
    if (!companyName?.trim()) {
      throw new DomainError(ERROR_CODES.COMPANY_NAME_REQUIRED);
    }

    if (!companyWebsite?.trim()) {
      throw new DomainError(ERROR_CODES.COMPANY_WEBSITE_REQUIRED);
    }

    return new RecruiterProfile(userId, companyName, companyWebsite);
  }

  public static fromPersistence(props: {
    userId: UserId;
    companyName?: string;
    companyWebsite?: string;
    companySize?: number;
    industry?: string;
    designation?: string;
    bio?: string;
    linkedinUrl?: string;
    location?: string;
    subscriptionStatus?: subscribtionStatus;
    jobPostsUsed?: number;
    verificationStatus?: verificationStatus;
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
      props.subscriptionStatus ?? "free",
      props.jobPostsUsed ?? 0,
      props.verificationStatus ?? "pending",
    );
  }

  public updateCompanyName(name: string): void {
    if (!name?.trim()) {
      throw new DomainError(ERROR_CODES.COMPANY_NAME_REQUIRED);
    }
    this.companyName = name;
  }

  public updateCompanyWebsite(url: string): void {
    if (!url?.trim()) {
      throw new DomainError(ERROR_CODES.COMPANY_WEBSITE_REQUIRED);
    }
    this.companyWebsite = url;
  }

  public updateIndustry(value: string): void {
    this.industry = value;
  }

  public updateCompanySize(size: number): void {
    if (size < 0) {
      throw new DomainError(ERROR_CODES.COMPANY_SIZE_INVALID);
    }
    this.companySize = size;
  }

  public updateDesignation(value: string): void {
    if (!value?.trim()) {
      throw new DomainError(ERROR_CODES.DESIGNATION_REQUIRED);
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

  public incrementJobPostsUsed(): void {
    this.jobPostsUsed += 1;
  }

  public activateSubscription(status: subscribtionStatus): void {
    this.subscriptionStatus = status;
  }

  public verify(): void {
    this.verificationStatus = "verified";
  }

  public getUserId(): UserId {
    return this.userId;
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

  public getSubscriptionStatus(): subscribtionStatus {
    return this.subscriptionStatus;
  }

  public getJobPostsUsed(): number {
    return this.jobPostsUsed;
  }

  public getVerificationStatus(): verificationStatus {
    return this.verificationStatus;
  }
}
