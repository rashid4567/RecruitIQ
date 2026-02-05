import type { SubscriptionStatus } from "../constatns/subscribtionStatus";
import type { VerificationStatus } from "../constatns/verificationStatus";

export class RecruiterProfile {
  public readonly fullName: string;
  public readonly email: string;

  public readonly companyName?: string;
  public readonly companyWebsite?: string;
  public readonly companySize?: number;
  public readonly industry?: string;
  public readonly location?: string;
  public readonly bio?: string;
  public readonly designation?: string;
  public readonly linkedinUrl?: string;

  public readonly subscriptionStatus: SubscriptionStatus;
  public readonly verificationStatus: VerificationStatus;
  public readonly jobPostsUsed: number; 

  constructor(params: {
    fullName: string;
    email: string;

    companyName?: string;
    companyWebsite?: string;
    companySize?: number;
    industry?: string;
    location?: string;
    bio?: string;
    designation?: string;
    linkedinUrl?: string;

    subscriptionStatus?: SubscriptionStatus;
    verificationStatus?: VerificationStatus;
    jobPostsUsed?: number; 
  }) {
    this.fullName = params.fullName;
    this.email = params.email;

    this.companyName = params.companyName;
    this.companyWebsite = params.companyWebsite;
    this.companySize = params.companySize;
    this.industry = params.industry;
    this.location = params.location;
    this.bio = params.bio;
    this.linkedinUrl = params.linkedinUrl;
    this.designation = params.designation;

    this.subscriptionStatus = params.subscriptionStatus ?? "free";
    this.verificationStatus = params.verificationStatus ?? "pending";
    this.jobPostsUsed = params.jobPostsUsed ?? 0;
  }

  updateProfile(data: {
    fullName?: string;
    companyName?: string;
    companyWebsite?: string;
    companySize?: number;
    industry?: string;
    location?: string;
    bio?: string;
    linkedinUrl?: string;
    designation?: string;
  }) {
    return new RecruiterProfile({
      fullName: data.fullName ?? this.fullName,
      email: this.email,

      companyName: data.companyName ?? this.companyName,
      companyWebsite: data.companyWebsite ?? this.companyWebsite,
      companySize: data.companySize ?? this.companySize,
      industry: data.industry ?? this.industry,
      location: data.location ?? this.location,
      bio: data.bio ?? this.bio,
      linkedinUrl: data.linkedinUrl ?? this.linkedinUrl,
      designation: data.designation ?? this.designation,

      subscriptionStatus: this.subscriptionStatus,
      verificationStatus: this.verificationStatus,
      jobPostsUsed: this.jobPostsUsed,
    });
  }



  completeProfile(data : {
    companyName : string;
    companyWebsite : string;
    companySize : number;
    industry : string;
    designation : string;
    location : string;
    bio : string;

  }){
    return new RecruiterProfile({
      fullName : this.fullName,
      email : this.email,

      companyName : data.companyName,
      companyWebsite : data.companyWebsite,
      companySize : data.companySize,
      industry : data.industry,
      designation : data.designation,
      bio : data.bio,

      subscriptionStatus : "free",
      verificationStatus : "pending",
      jobPostsUsed : 0,
    })
  }
}
