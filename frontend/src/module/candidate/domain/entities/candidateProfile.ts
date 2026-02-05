export class CandidateProfile {
  public readonly fullName: string;
  public readonly email: string;
  public readonly emailVerified: boolean;
  public readonly profileImage!: string;

  public readonly currentJob?: string;
  public readonly experienceYears?: number;
  public readonly educationLevel?: string;
  public readonly skills?: string[];
  public readonly preferredJobLocations?: string[];
  public readonly currentJobLocation?: string;
  public readonly gender?: string;
  public readonly linkedinUrl?: string;
  public readonly portfolioUrl?:string;
  public readonly bio?: string;

  public readonly profileCompleted: boolean;

  constructor(params: {
    fullName: string;
    email: string;
    emailVerified: boolean;
    profileImage: string;

    currentJob?: string;
    experienceYears?: number;
    educationLevel?: string;
    skills?: string[];
    preferredJobLocations?: string[];
    currentJobLocation?: string;
    gender?: string;
    linkedinUrl?: string;
    portfolioUrl ?:string;
    bio?: string;

    profileCompleted: boolean;
  }) {
    this.fullName = params.fullName;
    this.email = params.email;
    this.emailVerified = params.emailVerified;

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

  update(data: Partial<CandidateProfile>): CandidateProfile {
    return new CandidateProfile({
      fullName: data.fullName ?? this.fullName,
      email: this.email,
      emailVerified: this.emailVerified,
      profileImage: this.profileImage,

      currentJob: data.currentJob ?? this.currentJob,
      experienceYears: data.experienceYears ?? this.experienceYears,
      educationLevel: data.educationLevel ?? this.educationLevel,
      skills: data.skills ?? this.skills,
      preferredJobLocations:
        data.preferredJobLocations ?? this.preferredJobLocations,
      currentJobLocation: data.currentJobLocation ?? this.currentJobLocation,
      gender: data.gender ?? this.gender,
      linkedinUrl: data.linkedinUrl ?? this.linkedinUrl,
      portfolioUrl : data.portfolioUrl ?? this.portfolioUrl,
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
    portfolioUrl?:string;
    currentJobLocation?: string;
    gender?: string;
  }): CandidateProfile {
    if (this.profileCompleted) {
      throw new Error("Profile already completed");
    }

    if (!data.currentJob) {
      throw new Error("Current job is required");
    }

    if (!data.educationLevel) {
      throw new Error("Education level is required");
    }

    if (!data.skills || data.skills.length === 0) {
      throw new Error("At least one skill is required");
    }

    if (!data.bio) {
      throw new Error("Bio is required");
    }

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
      portfolioUrl : data.portfolioUrl,
      bio: data.bio,

      profileCompleted: true,
    });
  }
}
