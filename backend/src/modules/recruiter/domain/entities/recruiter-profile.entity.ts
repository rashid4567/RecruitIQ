import { subscribtionStatus } from "../constatns/subscribtionStatus.contsants";
import { verificationStatus } from "../constatns/verificationStatus.constants";
import { UserId } from "../value.object.ts/user-Id.vo";

export class RecruiterProfile {
  private constructor(
    private readonly userId: UserId,
    private companyName?: string,
    private companyWebsite?: string,
    private companySize?: number,
    private industry?: string,
    private designation?: string,
    private bio?: string,
    private location?: string,
    private subscrbtionStatus?: subscribtionStatus,
    private jobPostUser?: number,
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
    comopanySize?: number;
    industry?: string;
    designation?: string;
    bio?: string;
    location?: string;
    subscribtionStatus: subscribtionStatus;
    jobPostUsed: number;
    verificationStatus: verificationStatus;
  }): RecruiterProfile {
    return new RecruiterProfile(
      props.userId,
      props.companyName,
      props.companyWebsite,
      props.comopanySize,
      props.industry,
      props.designation,
      props.bio,
      props.location,
      props.subscribtionStatus,
      props.jobPostUsed,
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

  public getLocation(): string | undefined {
    return this.location;
  }
  public getSubscriptionStatus(): subscribtionStatus | undefined {
    return this.subscrbtionStatus;
  }

  public getUserId(): UserId {
    return this.userId;
  }
  public getJobPostsUsed(): number | undefined {
    return this.jobPostUser;
  }

  public getVerificationStatus(): verificationStatus | undefined {
    return this.verificationStatus;
  }
}
