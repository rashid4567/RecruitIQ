import type { Gender } from "../types/gender.types";

// Shape returned by GET /candidate/profile
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
  };
}

// Shape returned by PUT /candidate/profile (different backend serialization)
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

    this.profileCompleted = params.profileCompleted;
  }

  // For GET /candidate/profile
  static fromApi(data: CandidateProfileApiResponse): CandidateProfile {
    if (!data?.user || !data?.candidateProfile) {
      throw new Error(`Invalid API response shape: ${JSON.stringify(data)}`);
    }

    return new CandidateProfile({
      fullName: data.user.fullName.trim(),
      email: data.user.email,
      emailVerified: data.user.emailVerified ?? false,
      profileImage: data.user.profileImage ?? undefined,

      currentJob: data.candidateProfile.currentJob ?? undefined,
      experienceYears: data.candidateProfile.experienceYears ?? undefined,
      educationLevel: data.candidateProfile.educationLevel ?? undefined,
      skills: data.candidateProfile.skills ?? undefined,
      preferredJobLocations: data.candidateProfile.preferredJobLocations ?? undefined,
      currentJobLocation: data.candidateProfile.currentJobLocation ?? undefined,
      gender: data.candidateProfile.gender ?? undefined,
      linkedinUrl: data.candidateProfile.linkedinUrl ?? undefined,
      portfolioUrl: data.candidateProfile.portfolioUrl ?? undefined,
      bio: data.candidateProfile.bio ?? undefined,

      profileCompleted: data.candidateProfile.profileCompleted,
    });
  }

  // For PUT /candidate/profile (backend returns wrapped values and "profile" key)
  static fromUpdateApi(data: CandidateProfileUpdateApiResponse): CandidateProfile {
    if (!data?.user || !data?.profile) {
      throw new Error(`Invalid update API response shape: ${JSON.stringify(data)}`);
    }

    // email and id may be wrapped in { value: "..." } objects
    const email =
      typeof data.user.email === "string"
        ? data.user.email
        : data.user.email.value;

    return new CandidateProfile({
      fullName: data.user.fullName.trim(),
      email,
      emailVerified: false, // not returned by update endpoint, keep existing
      profileImage: data.user.profileImage ?? undefined,

      currentJob: data.profile.currentJob ?? undefined,
      experienceYears: data.profile.experienceYears ?? undefined,
      educationLevel: data.profile.educationLevel ?? undefined,
      skills: data.profile.skills ?? undefined,
      preferredJobLocations: data.profile.preferredJobLocations ?? undefined,
      currentJobLocation: data.profile.currentJobLocation ?? undefined,
      gender: data.profile.gender ?? undefined,
      linkedinUrl: data.profile.linkedinUrl ?? undefined,
      portfolioUrl: data.profile.portfolioUrl ?? undefined,
      bio: data.profile.bio ?? undefined,

      profileCompleted: data.profile.profileCompleted,
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
      preferredJobLocations: data.preferredJobLocations ?? this.preferredJobLocations,
      currentJobLocation: data.currentJobLocation ?? this.currentJobLocation,
      gender: data.gender ?? this.gender,
      linkedinUrl: data.linkedinUrl ?? this.linkedinUrl,
      portfolioUrl: data.portfolioUrl ?? this.portfolioUrl,
      bio: data.bio ?? this.bio,

      profileCompleted: this.profileCompleted,
    });
  }

  complete(data: {
    currentJob: string;
    educationLevel: string;
    skills: string[];
    preferredJobLocations: string[];
    bio: string;
    experienceYears?: number;
    linkedinUrl?: string;
    portfolioUrl?: string;
    currentJobLocation?: string;
    gender?: Gender;
  }): CandidateProfile {
    if (this.profileCompleted) {
      throw new Error("Profile already completed");
    }

    if (!data.currentJob) throw new Error("Current job is required");
    if (!data.educationLevel) throw new Error("Education level is required");
    if (!data.skills || data.skills.length === 0)
      throw new Error("At least one skill is required");
    if (!data.bio) throw new Error("Bio is required");

    return new CandidateProfile({
      fullName: this.fullName,
      email: this.email,
      emailVerified: this.emailVerified,
      profileImage: this.profileImage,

      currentJob: data.currentJob,
      experienceYears: data.experienceYears,
      educationLevel: data.educationLevel,
      skills: data.skills,
      preferredJobLocations: data.preferredJobLocations,
      currentJobLocation: data.currentJobLocation,
      gender: data.gender,
      linkedinUrl: data.linkedinUrl,
      portfolioUrl: data.portfolioUrl,
      bio: data.bio,

      profileCompleted: true,
    });
  }
}