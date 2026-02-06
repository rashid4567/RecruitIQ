export type CandidateStatus = "Active" | "Blocked";

export class Candidate {
  public readonly userId: string;
  public readonly name: string;
  public readonly email: string;
  public readonly status: CandidateStatus;
  public readonly registeredDate: string;
  public readonly location?: string;
  public readonly experience: number;
  public readonly applications: number;
  public readonly skills: string[];

  constructor(params: {
    userId: string;
    name: string;
    email: string;
    status: CandidateStatus;
    registeredDate: string;
    location?: string;
    experience?: number;
    applications?: number;
    skills?: string[];
  }) {
    

    if (!params.userId || typeof params.userId !== "string") {
      throw new Error("userId is required and must be a string");
    }

    this.userId = params.userId;
    this.name = params.name;
    this.email = params.email;
    this.status = params.status;
    this.registeredDate = params.registeredDate;
    this.location = params.location;
    this.experience = params.experience ?? 0;
    this.applications = params.applications ?? 0;
    this.skills = params.skills ?? [];
  }

  isActive(): boolean {
    return this.status === "Active";
  }

  isBlocked(): boolean {
    return this.status === "Blocked";
  }
}
