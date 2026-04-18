import { DomainError } from "../../../../shared/errors/domain.error";
import { ERROR_CODES } from "../constatns/recruiter.profile.error";

export type JobType = "full-time" | "part-time" | "contract" | "internship";
export type JobStatus = "draft" | "active" | "blocked" | "expired";

export interface LocationVO {
  city: string;
  state: string;
  country: string;
}

export interface SalaryVO {
  min: number;
  max: number;
  currency: string;
}

export class JobPost {
  private constructor(
    private readonly id: string | undefined,
    private readonly recruiterId: string,
    private title: string,
    private description: string,
    private responsibilities: string[],
    private requirements: string[],
    private requiredSkills: string[],
    private preferredSkills: string[],
    private experienceMin: number,
    private experienceMax: number,
    private location: LocationVO,
    private isRemote: boolean,
    private jobType: JobType,
    private salary: SalaryVO,
    private department: string,
    private positions: number,
    private status: JobStatus,
    private views: number,
    private applicationsCount: number,
    private isDeleted: boolean,
    private postedOn?: Date,
    private expiresAt?: Date,
    private externalLink?: string,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  // ─── Factory: create new ───────────────────────────────────────────────────

  public static create(props: {
    recruiterId: string;
    title: string;
    description: string;
    jobType: JobType;
    experienceMin: number;
    experienceMax: number;
    responsibilities?: string[];
    requirements?: string[];
    requiredSkills?: string[];
    preferredSkills?: string[];
    location?: Partial<LocationVO>;
    isRemote?: boolean;
    salary?: Partial<SalaryVO>;
    department?: string;
    positions?: number;
    status?: Extract<JobStatus, "draft" | "active">;
    expiresAt?: Date;
    externalLink?: string;
  }): JobPost {
    if (!props.title?.trim()) {
      throw new DomainError(ERROR_CODES.TITLE_REQUIRED);
    }
    if (!props.description?.trim()) {
      throw new DomainError(ERROR_CODES.DESCRIPTION_REQUIRED);
    }
    if (props.experienceMin < 0 || props.experienceMax < 0) {
      throw new DomainError(ERROR_CODES.EXPERIENCE_INVALID);
    }
    if (props.experienceMin > props.experienceMax) {
      throw new DomainError(ERROR_CODES.EXPERIENCE_MIN_GREATER_THAN_MAX);
    }

    const salary: SalaryVO = {
      min: props.salary?.min ?? 0,
      max: props.salary?.max ?? 0,
      currency: props.salary?.currency ?? "INR",
    };

    if (salary.min > salary.max) {
      throw new DomainError(ERROR_CODES.SALARY_MIN_GREATER_THAN_MAX);
    }

    const status = props.status ?? "draft";

    return new JobPost(
      undefined,
      props.recruiterId,
      props.title.trim(),
      props.description.trim(),
      props.responsibilities ?? [],
      props.requirements ?? [],
      props.requiredSkills ?? [],
      props.preferredSkills ?? [],
      props.experienceMin,
      props.experienceMax,
      {
        city: props.location?.city ?? "",
        state: props.location?.state ?? "",
        country: props.location?.country ?? "",
      },
      props.isRemote ?? false,
      props.jobType,
      salary,
      props.department ?? "",
      props.positions ?? 1,
      status,
      0,
      0,
      false,
      status === "active" ? new Date() : undefined,
      props.expiresAt,
      props.externalLink,
    );
  }

  // ─── Factory: from persistence ─────────────────────────────────────────────

  public static fromPersistence(props: {
    id: string;
    recruiterId: string;
    title: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    requiredSkills: string[];
    preferredSkills: string[];
    experienceMin: number;
    experienceMax: number;
    location: LocationVO;
    isRemote: boolean;
    jobType: JobType;
    salary: SalaryVO;
    department: string;
    positions: number;
    status: JobStatus;
    views: number;
    applicationsCount: number;
    isDeleted: boolean;
    postedOn?: Date;
    expiresAt?: Date;
    externalLink?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): JobPost {
    return new JobPost(
      props.id,
      props.recruiterId,
      props.title,
      props.description,
      props.responsibilities,
      props.requirements,
      props.requiredSkills,
      props.preferredSkills,
      props.experienceMin,
      props.experienceMax,
      props.location,
      props.isRemote,
      props.jobType,
      props.salary,
      props.department,
      props.positions,
      props.status,
      props.views,
      props.applicationsCount,
      props.isDeleted,
      props.postedOn,
      props.expiresAt,
      props.externalLink,
      props.createdAt,
      props.updatedAt,
    );
  }

  // ─── Domain methods ────────────────────────────────────────────────────────

  private guardNotExpired(): void {
    if (this.status === "expired") {
      throw new DomainError(ERROR_CODES.CANNOT_UPDATE_EXPIRED);
    }
  }

  public updateTitle(value: string): void {
    this.guardNotExpired();
    if (!value?.trim()) throw new DomainError(ERROR_CODES.TITLE_REQUIRED);
    this.title = value.trim();
  }

  public updateDescription(value: string): void {
    this.guardNotExpired();
    if (!value?.trim()) throw new DomainError(ERROR_CODES.DESCRIPTION_REQUIRED);
    this.description = value.trim();
  }

  public updateExperience(min: number, max: number): void {
    this.guardNotExpired();
    if (min < 0 || max < 0)
      throw new DomainError(ERROR_CODES.EXPERIENCE_INVALID);
    if (min > max)
      throw new DomainError(ERROR_CODES.EXPERIENCE_MIN_GREATER_THAN_MAX);
    this.experienceMin = min;
    this.experienceMax = max;
  }

  public updateSalary(salary: Partial<SalaryVO>): void {
    this.guardNotExpired();
    const updated: SalaryVO = {
      min: salary.min ?? this.salary.min,
      max: salary.max ?? this.salary.max,
      currency: salary.currency ?? this.salary.currency,
    };
    if (updated.min > updated.max) {
      throw new DomainError(ERROR_CODES.SALARY_MIN_GREATER_THAN_MAX);
    }
    this.salary = updated;
  }

  public updateLocation(location: Partial<LocationVO>): void {
    this.guardNotExpired();
    this.location = {
      city: location.city ?? this.location.city,
      state: location.state ?? this.location.state,
      country: location.country ?? this.location.country,
    };
  }

  public updateResponsibilities(value: string[]): void {
    this.guardNotExpired();
    this.responsibilities = value;
  }

  public updateRequirements(value: string[]): void {
    this.guardNotExpired();
    this.requirements = value;
  }

  public updateRequiredSkills(value: string[]): void {
    this.guardNotExpired();
    this.requiredSkills = value;
  }

  public updatePreferredSkills(value: string[]): void {
    this.guardNotExpired();
    this.preferredSkills = value;
  }

  public updateIsRemote(value: boolean): void {
    this.guardNotExpired();
    this.isRemote = value;
  }

  public updateJobType(value: JobType): void {
    this.guardNotExpired();
    this.jobType = value;
  }

  public updateDepartment(value: string): void {
    this.guardNotExpired();
    this.department = value?.trim() ?? "";
  }

  public updatePositions(value: number): void {
    this.guardNotExpired();
    if (value < 1) throw new DomainError(ERROR_CODES.POSITIONS_INVALID);
    this.positions = value;
  }

  public updateExpiresAt(value: Date): void {
    this.guardNotExpired();
    this.expiresAt = value;
  }

  public updateExternalLink(value: string): void {
    this.guardNotExpired();
    this.externalLink = value?.trim() || undefined;
  }

  public publish(): void {
    this.guardNotExpired();
    this.status = "active";
    this.postedOn = new Date();
  }

  public hide(): void {
    this.guardNotExpired();
    this.status = "blocked";
  }

  public unhide(): void {
    this.guardNotExpired();
    this.status = "active";
  }

  public softDelete(): void {
    this.isDeleted = true;
  }

  public incrementViews(): void {
    this.views += 1;
  }

  public incrementApplicationsCount(): void {
    this.applicationsCount += 1;
  }

  // ─── Getters ───────────────────────────────────────────────────────────────

  public getId(): string | undefined {
    return this.id;
  }
  public getRecruiterId(): string {
    return this.recruiterId;
  }
  public getTitle(): string {
    return this.title;
  }
  public getDescription(): string {
    return this.description;
  }
  public getResponsibilities(): string[] {
    return this.responsibilities;
  }
  public getRequirements(): string[] {
    return this.requirements;
  }
  public getRequiredSkills(): string[] {
    return this.requiredSkills;
  }
  public getPreferredSkills(): string[] {
    return this.preferredSkills;
  }
  public getExperienceMin(): number {
    return this.experienceMin;
  }
  public getExperienceMax(): number {
    return this.experienceMax;
  }
  public getLocation(): LocationVO {
    return this.location;
  }
  public getIsRemote(): boolean {
    return this.isRemote;
  }
  public getJobType(): JobType {
    return this.jobType;
  }
  public getSalary(): SalaryVO {
    return this.salary;
  }
  public getDepartment(): string {
    return this.department;
  }
  public getPositions(): number {
    return this.positions;
  }
  public getStatus(): JobStatus {
    return this.status;
  }
  public getViews(): number {
    return this.views;
  }
  public getApplicationsCount(): number {
    return this.applicationsCount;
  }
  public getIsDeleted(): boolean {
    return this.isDeleted;
  }
  public getPostedOn(): Date | undefined {
    return this.postedOn;
  }
  public getExpiresAt(): Date | undefined {
    return this.expiresAt;
  }
  public getExternalLink(): string | undefined {
    return this.externalLink;
  }
  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }
  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}
