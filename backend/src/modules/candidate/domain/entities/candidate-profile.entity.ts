import { UserId } from "../../../../shared/domain/value-objects.ts/userId.vo";

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
    private currentJobLocation?: string,
    private gender?: string,
    private linkedinUrl?: string,
    private portfolioUrl?: string,
    profileComplete = false,
  ) {
    this.profileComplete = profileComplete;
  }

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

  public static fromPersistence(props: {
    userId: UserId;
    currentJob: string;
    experienceYears?: number;
    skills: string[];
    educationLevel?: string;
    preferredJobLocations: string[];
    bio?: string;
    currentJobLocation?: string;
    gender?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    profileComplete: boolean;
  }): CandidateProfile {
    return new CandidateProfile(
      props.userId,
      props.currentJob,
      props.experienceYears,
      props.skills,
      props.educationLevel,
      props.preferredJobLocations,
      props.bio,
      props.currentJobLocation,
      props.gender,
      props.linkedinUrl,
      props.portfolioUrl,
      props.profileComplete,
    );
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

  public updateCurrentJob(currentJob : string):void{
    this.currentJob = currentJob
  }

  public updateExperienceYears(year : number):void{
    this.experienceYears = year
  }

  public updateBio(bio: string): void {
    this.bio = bio;
  }

  public updateCurrentJobLocation(location?: string): void {
    this.currentJobLocation = location;
  }

  public updateGender(gender?: string): void {
    this.gender = gender;
  }

  public updateLinkedinUrl(url?: string): void {
    this.linkedinUrl = url;
  }

  public updatePortfolioUrl(url?: string): void {
    this.portfolioUrl = url;
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

  public getSkills(): string[] {
    return [...this.skills];
  }
  public getEducationLevel(): string | undefined {
    return this.educationLevel;
  }

  public getBio(): string | undefined {
    return this.bio;
  }
  public getUserId(): UserId {
    return this.userId;
  }

  public getPreferredLocations(): string[] {
    return [...this.preferredJobLocations];
  }

  public getCurrentJobLocation(): string | undefined {
    return this.currentJobLocation;
  }

  public getGender(): string | undefined {
    return this.gender;
  }

  public getLinkedinUrl(): string | undefined {
    return this.linkedinUrl;
  }

  public getPortfolioUrl(): string | undefined {
    return this.portfolioUrl;
  }

  public isProfileCompleted(): boolean {
    return this.profileComplete;
  }
}
