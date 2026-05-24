export type CandidateStatus = "Active" | "Blocked";

export class Candidate {
  public readonly userId: string;
  public readonly name: string;
  public readonly email: string;
  public readonly status: CandidateStatus;
  public readonly registeredDate: string;
  public readonly currentJob?: string;
  public readonly experienceYears: number;
  public readonly educationLevel?: string;
  public readonly skills: string[];
  public readonly preferredJobLocations: string[];
  public readonly bio?: string;
  public readonly currentJobLocation?: string;
  public readonly gender?: string;
  public readonly linkedinUrl?: string;
  public readonly portfolioUrl?: string;
  public readonly profileCompleted: boolean;
  constructor(params: {
    userId: string;
    name: string;
    email: string;
    status: CandidateStatus;
    registeredDate: string;
    currentJob?: string;
    experienceYears?: number;
    educationLevel?: string;
    skills?: string[];
    preferredJobLocations?: string[];
    bio?: string;
    currentJobLocation?: string;
    gender?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    profileCompleted?: boolean;
  }) {
    if (!params.userId) {
      throw new Error("Candidate userId is required");
    }
    this.userId = params.userId;
    this.name = params.name;
    this.email = params.email;
    this.status = params.status;
    this.registeredDate = params.registeredDate;
    this.currentJob = params.currentJob;
    this.experienceYears = params.experienceYears ?? 0;
    this.educationLevel = params.educationLevel;
    this.skills = params.skills ?? [];
    this.preferredJobLocations =
      params.preferredJobLocations ?? [];
    this.bio = params.bio;
    this.currentJobLocation =
      params.currentJobLocation;
    this.gender = params.gender;
    this.linkedinUrl = params.linkedinUrl;
    this.portfolioUrl = params.portfolioUrl;
    this.profileCompleted =
      params.profileCompleted ?? false;
  }

  isActive(): boolean {
    return this.status === "Active";
  }

  isBlocked(): boolean {
    return this.status === "Blocked";
  }

  hasProfile(): boolean {
    return Boolean(
      this.bio ||
      this.skills.length ||
      this.currentJob
    );
  }

  withStatus(status: CandidateStatus): Candidate {
    return new Candidate({
      userId: this.userId,
      name: this.name,
      email: this.email,
      status,
      registeredDate: this.registeredDate,
      currentJob: this.currentJob,
      experienceYears: this.experienceYears,
      educationLevel: this.educationLevel,
      skills: this.skills,
      preferredJobLocations:
        this.preferredJobLocations,
      bio: this.bio,
      currentJobLocation:
        this.currentJobLocation,
      gender: this.gender,
      linkedinUrl: this.linkedinUrl,
      portfolioUrl: this.portfolioUrl,
      profileCompleted:
        this.profileCompleted,
    });
  }
}