import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { Gender } from "../type/gender.Types";

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
    private gender?: Gender,
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
    if (!userId) {
      throw new Error("User id is required");
    }

    if (!currentJob?.trim()) {
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
    skills?: string[];
    educationLevel?: string;
    preferredJobLocations?: string[];
    bio?: string;
    currentJobLocation?: string;
    gender?: Gender;
    linkedinUrl?: string;
    portfolioUrl?: string;
    profileComplete?: boolean;
  }): CandidateProfile {
    return new CandidateProfile(
      props.userId,
      props.currentJob ?? "",
      props.experienceYears,
      props.skills ?? [],
      props.educationLevel,
      props.preferredJobLocations ?? [],
      props.bio,
      props.currentJobLocation,
      props.gender,
      props.linkedinUrl,
      props.portfolioUrl,
      props.profileComplete ?? false,
    );
  }



  public canBeCompleted(): boolean {
    return (
      this.skills.length > 0 &&
      !!this.educationLevel?.trim() &&
      !!this.bio?.trim()
    );
  }

  public completeProfile(): void {
    if (!this.canBeCompleted()) {
      throw new Error("Profile cannot be completed. Missing required fields");
    }
    this.profileComplete = true;
  }

 

  public updateCurrentJob(currentJob: string): void {
    if (!currentJob?.trim()) {
      throw new Error("Current job cannot be empty");
    }
    this.currentJob = currentJob.trim();
  }

  public updateExperienceYears(year?: number): void {
    if (year !== undefined && year < 0) {
      throw new Error("Experience years cannot be negative");
    }
    this.experienceYears = year;
  }

  public updateSkills(skills: string[]): void {
    if (!skills || skills.length === 0) {
      throw new Error("At least one skill is required");
    }
    this.skills = [...skills];
  }

  public updateEducation(level: string): void {
    if (!level?.trim()) {
      throw new Error("Education level cannot be empty");
    }
    this.educationLevel = level.trim();
  }

  public updatePreferredLocations(locations: string[]): void {
    if (!locations || locations.length === 0) {
      throw new Error("At least one location is required");
    }
    this.preferredJobLocations = [...locations];
  }

  public updateBio(bio?: string): void {
    if (bio && bio.length > 500) {
      throw new Error("Bio cannot exceed 500 characters");
    }
    this.bio = bio;
  }

  public updateCurrentJobLocation(location?: string): void {
    this.currentJobLocation = location;
  }

  public updateGender(gender?: Gender): void {
    const allowed = ["male", "female", "other"];
    if (gender && !allowed.includes(gender)) {
      throw new Error("Invalid gender value");
    }
    this.gender = gender;
  }

  public updateLinkedinUrl(url?: string): void {
    this.linkedinUrl = url;
  }

  public updatePortfolioUrl(url?: string): void {
    this.portfolioUrl = url;
  }

  public getUserId(): UserId {
    return this.userId;
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

  public getPreferredLocations(): string[] {
    return [...this.preferredJobLocations];
  }

  public getBio(): string | undefined {
    return this.bio;
  }

  public getCurrentJobLocation(): string | undefined {
    return this.currentJobLocation;
  }

  public getGender(): Gender | undefined {
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
