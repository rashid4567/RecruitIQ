import type { Gender } from "../types/gender.types";
import type { ResumeDTO } from "../dto/ResumeDTO";

export interface CandidateProfileApiResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    emailVerified?: boolean;
    profileImage?: string;
  };

  candidateProfile: {
    currentJob?: string;
    experienceYears?: number;
    educationLevel?: string;
    skills?: string[];
    preferredJobLocations?: string[];
    currentJobLocation?: string;
    gender?: Gender;
    linkedinUrl?: string;
    portfolioUrl?: string;
    bio?: string;
    profileCompleted: boolean;
    resume?: ResumeDTO | null;
  };
}

export interface CandidateProfileUpdateApiResponse {
  user: {
    id: { value: string } | string;
    fullName: string;
    email: { value: string } | string;
    profileImage?: string;
  };

  profile: {
    currentJob?: string;
    experienceYears?: number;
    educationLevel?: string;
    skills?: string[];
    preferredJobLocations?: string[];
    currentJobLocation?: string;
    gender?: Gender;
    linkedinUrl?: string;
    portfolioUrl?: string;
    bio?: string;
    profileCompleted: boolean;
    resume?: ResumeDTO | null;
  };
}

export class CandidateProfile {
  public readonly fullName: string;
  public readonly email: string;
  public readonly emailVerified: boolean;
  public readonly profileImage?: string;

  public readonly currentJob?: string;
  public readonly experienceYears?: number;
  public readonly educationLevel?: string;
  public readonly skills?: string[];
  public readonly preferredJobLocations?: string[];
  public readonly currentJobLocation?: string;
  public readonly gender?: Gender;
  public readonly linkedinUrl?: string;
  public readonly portfolioUrl?: string;
  public readonly bio?: string;

  public readonly resume?: ResumeDTO | null;

  public readonly profileCompleted: boolean;

  constructor(params: {
    fullName: string;
    email: string;
    emailVerified: boolean;
    profileImage?: string;

    currentJob?: string;
    experienceYears?: number;
    educationLevel?: string;
    skills?: string[];
    preferredJobLocations?: string[];
    currentJobLocation?: string;
    gender?: Gender;
    linkedinUrl?: string;
    portfolioUrl?: string;
    bio?: string;

    resume?: ResumeDTO | null;

    profileCompleted: boolean;
  }) {
    this.fullName = params.fullName;
    this.email = params.email;
    this.emailVerified = params.emailVerified;
    this.profileImage = params.profileImage;

    this.currentJob = params.currentJob;
    this.experienceYears = params.experienceYears;
    this.educationLevel = params.educationLevel;
    this.skills = params.skills;
    this.preferredJobLocations = params.preferredJobLocations;
    this.currentJobLocation = params.currentJobLocation;
    this.gender = params.gender;
    this.linkedinUrl = params.linkedinUrl;
    this.portfolioUrl = params.portfolioUrl;
    this.bio = params.bio;

    this.resume = params.resume;

    this.profileCompleted = params.profileCompleted;
  }

  static fromApi(data: CandidateProfileApiResponse): CandidateProfile {
    return new CandidateProfile({
      fullName: data.user.fullName.trim(),
      email: data.user.email,
      emailVerified: data.user.emailVerified ?? false,
      profileImage: data.user.profileImage,

      currentJob: data.candidateProfile.currentJob,
      experienceYears: data.candidateProfile.experienceYears,
      educationLevel: data.candidateProfile.educationLevel,
      skills: data.candidateProfile.skills,
      preferredJobLocations:
        data.candidateProfile.preferredJobLocations,
      currentJobLocation:
        data.candidateProfile.currentJobLocation,
      gender: data.candidateProfile.gender,
      linkedinUrl: data.candidateProfile.linkedinUrl,
      portfolioUrl: data.candidateProfile.portfolioUrl,
      bio: data.candidateProfile.bio,

      resume: data.candidateProfile.resume ?? null,

      profileCompleted:
        data.candidateProfile.profileCompleted,
    });
  }

  static fromUpdateApi(
    data: CandidateProfileUpdateApiResponse,
  ): CandidateProfile {
    const email =
      typeof data.user.email === "string"
        ? data.user.email
        : data.user.email.value;

    return new CandidateProfile({
      fullName: data.user.fullName.trim(),
      email,
      emailVerified: false,
      profileImage: data.user.profileImage,

      currentJob: data.profile.currentJob,
      experienceYears: data.profile.experienceYears,
      educationLevel: data.profile.educationLevel,
      skills: data.profile.skills,
      preferredJobLocations:
        data.profile.preferredJobLocations,
      currentJobLocation:
        data.profile.currentJobLocation,
      gender: data.profile.gender,
      linkedinUrl: data.profile.linkedinUrl,
      portfolioUrl: data.profile.portfolioUrl,
      bio: data.profile.bio,

      resume: data.profile.resume ?? null,

      profileCompleted:
        data.profile.profileCompleted,
    });
  }

  update(data: {
    fullName?: string;
    profileImage?: string;
    currentJob?: string;
    experienceYears?: number;
    educationLevel?: string;
    skills?: string[];
    preferredJobLocations?: string[];
    currentJobLocation?: string;
    gender?: Gender;
    linkedinUrl?: string;
    portfolioUrl?: string;
    bio?: string;
  }): CandidateProfile {
    return new CandidateProfile({
      fullName: data.fullName ?? this.fullName,
      email: this.email,
      emailVerified: this.emailVerified,
      profileImage: data.profileImage ?? this.profileImage,

      currentJob: data.currentJob ?? this.currentJob,
      experienceYears: data.experienceYears ?? this.experienceYears,
      educationLevel: data.educationLevel ?? this.educationLevel,
      skills: data.skills ?? this.skills,
      preferredJobLocations:
        data.preferredJobLocations ??
        this.preferredJobLocations,
      currentJobLocation:
        data.currentJobLocation ??
        this.currentJobLocation,
      gender: data.gender ?? this.gender,
      linkedinUrl: data.linkedinUrl ?? this.linkedinUrl,
      portfolioUrl: data.portfolioUrl ?? this.portfolioUrl,
      bio: data.bio ?? this.bio,

      resume: this.resume,

      profileCompleted: this.profileCompleted,
    });
  }
}