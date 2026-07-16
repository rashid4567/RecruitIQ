import { subscriptionStatus } from "../constatns/subscriptionStatus.constants";
import { verificationStatus } from "../constatns/verificationStatus.constants";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { DomainError } from "../../../../shared/errors/domain.error";
import { DOMAIN_ERROR_CODES } from "../../../../shared/constants/domain.error.code"; 


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
  subscriptionStatus: subscriptionStatus;
  jobPostsUsed: number;
  verificationStatus: verificationStatus;
  profileCompleted: boolean;
}

export class RecruiterProfile {
  
  private constructor(private props: RecruiterProfileProps) {}

  public static create(
    userId: UserId,
    companyName: string,
    companyWebsite: string,
  ): RecruiterProfile {
    if (!companyName?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.COMPANY_NAME_REQUIRED);
    }
    if (!companyWebsite?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.COMPANY_WEBSITE_REQUIRED);
    } 
    return new RecruiterProfile({
      userId,
      companyName: companyName.trim(),
      companyWebsite: companyWebsite.trim(),
      subscriptionStatus: "free",
      jobPostsUsed: 0,
      verificationStatus: "pending",
      profileCompleted : false,
    });
  }


  public static createEmpty(userId: UserId): RecruiterProfile {
    return new RecruiterProfile({
      userId,
      subscriptionStatus: "free",
      jobPostsUsed: 0,
      verificationStatus: "pending",
      profileCompleted : false,
    });
  }


  public static reconstitute(props: RecruiterProfileProps): RecruiterProfile {
    return new RecruiterProfile({ ...props });
  }

  private assertNotEmpty(value: string | undefined, errorCode: string): void {
    if (!value?.trim()) throw new DomainError(errorCode);
  }


  public updateCompanyName(name: string): void {
    this.assertNotEmpty(name, DOMAIN_ERROR_CODES.COMPANY_NAME_REQUIRED);
    this.props.companyName = name.trim();
  }

  public updateCompanyWebsite(url: string): void {
    this.assertNotEmpty(url, DOMAIN_ERROR_CODES.COMPANY_WEBSITE_REQUIRED);
    this.props.companyWebsite = url.trim();
  }

  public updateIndustry(value: string): void {
    this.props.industry = value?.trim() || undefined;
  }

  public updateCompanySize(size: number): void {
    if (size < 0) throw new DomainError(DOMAIN_ERROR_CODES.COMPANY_SIZE_INVALID);
    this.props.companySize = size;
  }

  public updateDesignation(value: string): void {
    this.assertNotEmpty(value, DOMAIN_ERROR_CODES.DESIGNATION_REQUIRED);
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

  public completeProfile(): void {
  this.props.profileCompleted = true;
}

public isProfileCompleted(): boolean {
  return this.props.profileCompleted;
}

 public updateSubscriptionStatus(status: subscriptionStatus): void {
  this.props.subscriptionStatus = status;
}
 public updateVerificationStatus(
   status: verificationStatus
): void {
   this.props.verificationStatus = status;
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
  public getSubscriptionStatus(): subscriptionStatus {
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