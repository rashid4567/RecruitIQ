import { UserId } from "../value-objects/user-id.vo";

export class CandidateProfile {
  private profileComplete = false;

  private constructor(
    private readonly userId: UserId,
    private currentJob: string,
    private experienceYears?: number,
    private skills: string[] = [],
    private educationLevel?: string,
    private preferredJobLocations: string[] = [],
    private bio?: string,
  ) {}

  public static create(
    userId: UserId,
    currentJob: string,
    experienceYears?: number,
  ): CandidateProfile {
    if (!currentJob || currentJob.trim().length === 0) {
      throw new Error("Current job is required");
    }

    if (experienceYears !== undefined && experienceYears < 0) {
      throw new Error("Experience years cannot be negative");
    }

    return new CandidateProfile(userId, currentJob, experienceYears);
  }

  public updateSkills(skills: string[]): void {
    if (!skills || skills.length === 0) {
      throw new Error("At least one skill is required");
    }
    this.skills = [...skills];
  }

  public updateEducation(level: string): void {
    if (!level || level.trim().length === 0) {
      throw new Error("Education level cannot be empty");
    }
    this.educationLevel = level;
  }

  public updatePreferredLocations(locations: string[]): void {
    if (!locations || locations.length === 0) {
      throw new Error("At least one location is required");
    }
    this.preferredJobLocations = [...locations];
  }

  public updateBio(bio: string): void {
    this.bio = bio;
  }

  public completeProfile(): void {
    if (this.skills.length === 0 || !this.educationLevel || !this.bio) {
      throw new Error("Profile not completed");
    }
    this.profileComplete = true;
  }
  public getCurrentJob(): string {
    return this.currentJob;
  }

  public getExperienceYears(): number | undefined {
    return this.experienceYears;
  }

  public getSkills(): string[]{
    return [...this.skills];
  }
  public getEducationLevel(): string | undefined {
    return this.educationLevel;
  }

  public getBio():string | undefined{
    return this.bio
  }
  public getUserId(): UserId {
    return this.userId;
  }

  public getPreferredLocations():string[]{
    return [...this.preferredJobLocations]
  }

  public isProfileCompleted(): boolean {
    return this.profileComplete;
  }
}
