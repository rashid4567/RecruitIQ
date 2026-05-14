import { subscribtionStatus } from "../constatns/subscribtionStatus.contsants";
import { verificationStatus } from "../constatns/verificationStatus.constants";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { DomainError } from "../../../../shared/errors/domain.error";
import { ERROR_CODES } from "../constatns/recruiter.profile.error";

export interface RecruiterProfileProps {
  userId: UserId;
  companyName?: string;
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
}

export class RecruiterProfile {
  private constructor(private props: RecruiterProfileProps) {}

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
    return new RecruiterProfile({
      userId,
      companyName: companyName.trim(),
      companyWebsite: companyWebsite.trim(),
      subscriptionStatus: "free",
      jobPostsUsed: 0,
      verificationStatus: "pending",
    });
  }


  public static createEmpty(userId: UserId): RecruiterProfile {
    return new RecruiterProfile({
      userId,
      subscriptionStatus: "free",
      jobPostsUsed: 0,
      verificationStatus: "pending",
    });
  }


  public static reconstitute(props: RecruiterProfileProps): RecruiterProfile {
    return new RecruiterProfile({ ...props });
  }

  private assertNotEmpty(value: string | undefined, errorCode: string): void {
    if (!value?.trim()) throw new DomainError(errorCode);
  }


  public updateCompanyName(name: string): void {
    this.assertNotEmpty(name, ERROR_CODES.COMPANY_NAME_REQUIRED);
    this.props.companyName = name.trim();
  }

  public updateCompanyWebsite(url: string): void {
    this.assertNotEmpty(url, ERROR_CODES.COMPANY_WEBSITE_REQUIRED);
    this.props.companyWebsite = url.trim();
  }

  public updateIndustry(value: string): void {
    this.props.industry = value?.trim() || undefined;
  }

  public updateCompanySize(size: number): void {
    if (size < 0) throw new DomainError(ERROR_CODES.COMPANY_SIZE_INVALID);
    this.props.companySize = size;
  }

  public updateDesignation(value: string): void {
    this.assertNotEmpty(value, ERROR_CODES.DESIGNATION_REQUIRED);
    this.props.designation = value.trim();
  }

  public updateBio(value: string): void {
    this.props.bio = value?.trim() || undefined;
  }

  public updateLinkedinUrl(value: string): void {
    this.props.linkedinUrl = value?.trim() || undefined;
  }

  public updateLocation(value: string): void {
    this.props.location = value?.trim() || undefined;
  }

  public incrementJobPostsUsed(): void {
    this.props.jobPostsUsed += 1;
  }

  public activateSubscription(status: subscribtionStatus): void {
    this.props.subscriptionStatus = status;
  }

  public verify(): void {
    this.props.verificationStatus = "verified";
  }

  public getUserId(): UserId {
    return this.props.userId;
  }
  public getCompanyName(): string | undefined {
    return this.props.companyName;
  }
  public getCompanyWebsite(): string | undefined {
    return this.props.companyWebsite;
  }
  public getIndustry(): string | undefined {
    return this.props.industry;
  }
  public getCompanySize(): number | undefined {
    return this.props.companySize;
  }
  public getDesignation(): string | undefined {
    return this.props.designation;
  }
  public getBio(): string | undefined {
    return this.props.bio;
  }
  public getLinkedinUrl(): string | undefined {
    return this.props.linkedinUrl;
  }
  public getLocation(): string | undefined {
    return this.props.location;
  }
  public getSubscriptionStatus(): subscribtionStatus {
    return this.props.subscriptionStatus;
  }
  public getJobPostsUsed(): number {
    return this.props.jobPostsUsed;
  }
  public getVerificationStatus(): verificationStatus {
    return this.props.verificationStatus;
  }

  public getProps(): Readonly<RecruiterProfileProps> {
    return { ...this.props };
  }
}