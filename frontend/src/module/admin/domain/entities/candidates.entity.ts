export type CandidateStatus = "Active" | "Blocked";

export class Candidate {
  public readonly userId: string;
  public readonly name: string;
  public readonly email: string;
  public readonly status: CandidateStatus;
  public readonly registeredDate: string;
  public readonly jobTitle?: string;
  public readonly experience: number;
  public readonly skills: string[];
  public readonly summary?: string;
  public readonly location?: string;

  constructor(params: {
    userId: string;
    name: string;
    email: string;
    status: CandidateStatus;
    registeredDate: string;

    jobTitle?: string;
    experience?: number;
    skills?: string[];
    summary?: string;
    location?: string;
  }) {
    if (!params.userId) {
      throw new Error("Candidate userId is required");
    }

    this.userId = params.userId;
    this.name = params.name;
    this.email = params.email;
    this.status = params.status;
    this.registeredDate = params.registeredDate;

    this.jobTitle = params.jobTitle;
    this.experience = params.experience ?? 0;
    this.skills = params.skills ?? [];
    this.summary = params.summary;
    this.location = params.location;
  }

  isActive(): boolean {
    return this.status === "Active";
  }

  isBlocked(): boolean {
    return this.status === "Blocked";
  }

  hasProfile(): boolean {
    return Boolean(this.summary || this.skills.length);
  }

  withStatus(status: CandidateStatus): Candidate {
    return new Candidate({
      userId: this.userId,
      name: this.name,
      email: this.email,
      registeredDate: this.registeredDate,
      status,
      jobTitle: this.jobTitle,
      experience: this.experience,
      skills: this.skills,
      summary: this.summary,
      location: this.location,
    });
  }
}
