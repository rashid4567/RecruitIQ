import { UserId } from "../../../../shared/value-objects/userId.vo";

export type JobType = "full-time" | "part-time" | "contract" | "internship";
export type JobStatus = "draft" | "active" | "expired";
export type JobVisibility = "active" | "hidden";

export interface JobLocation {
  city: string;
  state: string;
  country: string;
}

export interface JobSalary {
  min: number;
  max: number;
  currency: string;
}

export class JobPost {
  private constructor(
    private readonly id: string,
    private readonly recruiterId: UserId,
    private readonly title: string,
    private readonly description: string,
    private readonly responsibilities: string[],
    private readonly requirements: string[],
    private readonly requiredSkills: string[],
    private readonly preferredSkills: string[],
    private readonly experienceMin: number,
    private readonly experienceMax: number,
    private readonly location: JobLocation,
    private readonly isRemote: boolean,
    private readonly jobType: JobType,
    private readonly salary: JobSalary,
    private readonly department: string,
    private readonly positions: number,
    private readonly visibility: JobVisibility,
    private readonly isBlocked: boolean,
    private readonly status: JobStatus,
    private readonly postedOn?: Date,
    private readonly expiresAt?: Date,
    private readonly externalLink?: string,
    private readonly views: number = 0,
    private readonly applicationsCount: number = 0,
    private readonly isDeleted: boolean = false,
    private readonly createdAt: Date = new Date(),
    private readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    id: string;
    recruiterId: UserId;
    title: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    requiredSkills: string[];
    preferredSkills: string[];
    experienceMin: number;
    experienceMax: number;
    location: JobLocation;
    isRemote: boolean;
    jobType: JobType;
    salary: JobSalary;
    department: string;
    positions: number;
    visibility: JobVisibility;
    isBlocked: boolean;
    status: JobStatus;
    postedOn?: Date;
    expiresAt?: Date;
    externalLink?: string;
    views?: number;
    applicationsCount?: number;
    isDeleted?: boolean;
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
      props.visibility,
      props.isBlocked,
      props.status,
      props.postedOn,
      props.expiresAt,
      props.externalLink,
      props.views ?? 0,
      props.applicationsCount ?? 0,
      props.isDeleted ?? false,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }

  getId() {
    return this.id;
  }

  getRecruiterId() {
    return this.recruiterId;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getResponsibilities() {
    return this.responsibilities;
  }

  getRequirements() {
    return this.requirements;
  }

  getRequiredSkills() {
    return this.requiredSkills;
  }

  getPreferredSkills() {
    return this.preferredSkills;
  }

  getExperienceMin() {
    return this.experienceMin;
  }

  getExperienceMax() {
    return this.experienceMax;
  }

  getLocation() {
    return this.location;
  }

  isRemoteJob() {
    return this.isRemote;
  }

  getJobType() {
    return this.jobType;
  }

  getSalary() {
    return this.salary;
  }

  getDepartment() {
    return this.department;
  }

  getPositions() {
    return this.positions;
  }

  getVisibility() {
    return this.visibility;
  }

  isBlockedJob() {
    return this.isBlocked;
  }

  getStatus() {
    return this.status;
  }

  getPostedOn() {
    return this.postedOn;
  }

  getExpiresAt() {
    return this.expiresAt;
  }

  getExternalLink() {
    return this.externalLink;
  }

  getViews() {
    return this.views;
  }

  getApplicationsCount() {
    return this.applicationsCount;
  }

  isDeletedJob() {
    return this.isDeleted;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  isVisible(): boolean {
    return (
      !this.isBlocked &&
      !this.isDeleted &&
      this.visibility === "active" &&
      this.status === "active"
    );
  }

  salaryRange(): string {
    return `${this.salary.currency} ${this.salary.min.toLocaleString()} – ${this.salary.max.toLocaleString()}`;
  }

  withBlockToggled(): JobPost {
    return new JobPost(
      this.id,
      this.recruiterId,
      this.title,
      this.description,
      this.responsibilities,
      this.requirements,
      this.requiredSkills,
      this.preferredSkills,
      this.experienceMin,
      this.experienceMax,
      this.location,
      this.isRemote,
      this.jobType,
      this.salary,
      this.department,
      this.positions,
      this.visibility,
      !this.isBlocked,
      this.status,
      this.postedOn,
      this.expiresAt,
      this.externalLink,
      this.views,
      this.applicationsCount,
      this.isDeleted,
      this.createdAt,
      new Date(),
    );
  }
}
