import { DomainError } from "../../../../shared/errors/domain.error";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { CANDIDATE_ERROR } from "../error/error.codes";
import { Gender } from "../type/gender.Types";

export class CandidateProfile {
  private profileCompleted = false;

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
    profileCompleted = false,
  ) {
    this.profileCompleted = profileCompleted;
  }

  public static create(
    userId: UserId,
    currentJob?: string,
    experienceYears?: number,
  ): CandidateProfile {
    if (!userId) throw new DomainError(CANDIDATE_ERROR.USER_ID_IS_REQUIRED);
    if (experienceYears !== undefined && experienceYears < 0)
      throw new DomainError(
        CANDIDATE_ERROR.EXPERIENCE_YEARS_CANNOT_BE_NEGATIVE,
      );

    return new CandidateProfile(
      userId,
      currentJob?.trim() ?? "",
      experienceYears,
    );
  }

  public static fromPersistence(props: {
    userId: UserId;
    currentJob?: string;
    experienceYears?: number;
    skills?: string[];
    educationLevel?: string;
    preferredJobLocations?: string[];
    bio?: string;
    currentJobLocation?: string;
    gender?: Gender;
    linkedinUrl?: string;
    portfolioUrl?: string;
    profileCompleted?: boolean;
  }): CandidateProfile {
    return new CandidateProfile(
      props.userId,
      props.currentJob?.trim() ?? "",
      props.experienceYears,
      props.skills ?? [],
      props.educationLevel?.trim() || undefined,
      props.preferredJobLocations ?? [],
      props.bio?.trim() || undefined,
      props.currentJobLocation?.trim() || undefined,
      props.gender,
      props.linkedinUrl?.trim() || undefined,
      props.portfolioUrl?.trim() || undefined,
      props.profileCompleted ?? false,
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
      throw new DomainError(CANDIDATE_ERROR.PROFILE_CANNOT_BE_COMPLETED);
    }
    this.profileCompleted = true;
  }

  public updateCurrentJob(currentJob: string): void {
    if (!currentJob?.trim())
      throw new DomainError(CANDIDATE_ERROR.CURRENT_JOB_CANNOT_BE_EMPTY);
    this.currentJob = currentJob.trim();
  }

  public updateExperienceYears(year?: number): void {
    if (year !== undefined && year < 0)
      throw new DomainError(
        CANDIDATE_ERROR.EXPERIENCE_YEARS_CANNOT_BE_NEGATIVE,
      );
    this.experienceYears = year;
  }

  public updateSkills(skills: string[]): void {
    if (!skills || skills.length === 0)
      throw new DomainError(CANDIDATE_ERROR.AT_LEAST_ONE_SKILL_IS_REQUIRED);
    this.skills = skills.map((s) => s.trim()).filter(Boolean);
  }

  public updateEducation(level: string): void {
    if (!level?.trim())
      throw new DomainError(CANDIDATE_ERROR.EDUCATION_LEVEL_CANNOT_BE_EMPTY);
    this.educationLevel = level.trim();
  }

  public updatePreferredLocations(locations: string[]): void {
    if (!locations || locations.length === 0)
      throw new DomainError(CANDIDATE_ERROR.AT_LEAST_ONE_LOCATION_IS_REQUIRED);
    this.preferredJobLocations = locations.map((l) => l.trim()).filter(Boolean);
  }

  public updateBio(bio?: string): void {
    if (bio && bio.length > 500)
      throw new DomainError(CANDIDATE_ERROR.BIO_EXCEEDS_MAX_LENGTH);
    this.bio = bio?.trim() || undefined;
  }

  public updateCurrentJobLocation(location?: string): void {
    this.currentJobLocation = location?.trim() || undefined;
  }

  public updateGender(gender?: Gender): void {
    this.gender = gender;
  }

  public updateLinkedinUrl(url?: string): void {
    if (url && !url.startsWith("http"))
      throw new DomainError(CANDIDATE_ERROR.INVALID_LINKEDIN_URL);
    this.linkedinUrl = url?.trim() || undefined;
  }

  public updatePortfolioUrl(url?: string): void {
    if (url && !url.startsWith("http"))
      throw new DomainError(CANDIDATE_ERROR.INVALID_PORTFOLIO_URL);
    this.portfolioUrl = url?.trim() || undefined;
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
    return this.profileCompleted;
  }
}
