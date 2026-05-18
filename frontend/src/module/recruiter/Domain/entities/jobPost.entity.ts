import type { LocationVO, SalaryVO } from "../../presentation/types/jobForm.types";
import type { JobStatus, JobType, JobVisibility } from "../dto/jobPost.dto";

export class JobPost {
  public readonly id: string;
  public readonly recruiterId: string;
  public readonly title: string;
  public readonly description: string;
  public readonly responsibilities: string[];
  public readonly requirements: string[];
  public readonly requiredSkills: string[];
  public readonly preferredSkills: string[];
  public readonly experienceMin: number;
  public readonly experienceMax: number;
  public readonly location: LocationVO;
  public readonly isRemote: boolean;
  public readonly jobType: JobType;
  public readonly salary: SalaryVO;
  public readonly department: string;
  public readonly positions: number;
  public readonly visibility: JobVisibility;  
  public readonly isBlocked: boolean;         
  public readonly status: JobStatus;         
  public readonly views: number;
  public readonly applicationsCount: number;
  public readonly isDeleted: boolean;
  public readonly postedOn?: Date;
  public readonly expiresAt?: Date;
  public readonly externalLink?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(params: {
    id: string;
    recruiterId: string;
    title: string;
    description: string;
    responsibilities?: string[];
    requirements?: string[];
    requiredSkills?: string[];
    preferredSkills?: string[];
    experienceMin: number;
    experienceMax: number;
    location?: Partial<LocationVO>;
    isRemote?: boolean;
    jobType: JobType;
    salary?: Partial<SalaryVO>;
    department?: string;
    positions?: number;
    visibility?: JobVisibility;
    isBlocked?: boolean;
    status?: JobStatus;
    views?: number;
    applicationsCount?: number;
    isDeleted?: boolean;
    postedOn?: Date;
    expiresAt?: Date;
    externalLink?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.recruiterId = params.recruiterId;
    this.title = params.title;
    this.description = params.description;
    this.responsibilities = params.responsibilities ?? [];
    this.requirements = params.requirements ?? [];
    this.requiredSkills = params.requiredSkills ?? [];
    this.preferredSkills = params.preferredSkills ?? [];
    this.experienceMin = params.experienceMin;
    this.experienceMax = params.experienceMax;
    this.location = {
      city: params.location?.city ?? "",
      state: params.location?.state ?? "",
      country: params.location?.country ?? "",
    };
    this.isRemote = params.isRemote ?? false;
    this.jobType = params.jobType;
    this.salary = {
      min: params.salary?.min ?? 0,
      max: params.salary?.max ?? 0,
      currency: params.salary?.currency ?? "INR",
    };
    this.department = params.department ?? "";
    this.positions = params.positions ?? 1;
    this.visibility = params.visibility ?? "active";
    this.isBlocked = params.isBlocked ?? false;
    this.status = params.status ?? "draft";
    this.views = params.views ?? 0;
    this.applicationsCount = params.applicationsCount ?? 0;
    this.isDeleted = params.isDeleted ?? false;
    this.postedOn = params.postedOn;
    this.expiresAt = params.expiresAt;
    this.externalLink = params.externalLink;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  update(data: {
    title?: string;
    description?: string;
    responsibilities?: string[];
    requirements?: string[];
    requiredSkills?: string[];
    preferredSkills?: string[];
    experienceMin?: number;
    experienceMax?: number;
    location?: Partial<LocationVO>;
    isRemote?: boolean;
    jobType?: JobType;
    salary?: Partial<SalaryVO>;
    department?: string;
    positions?: number;
    expiresAt?: Date;
    externalLink?: string;
  }): JobPost {
    return new JobPost({
      ...this.toParams(),
      title: data.title ?? this.title,
      description: data.description ?? this.description,
      responsibilities: data.responsibilities ?? this.responsibilities,
      requirements: data.requirements ?? this.requirements,
      requiredSkills: data.requiredSkills ?? this.requiredSkills,
      preferredSkills: data.preferredSkills ?? this.preferredSkills,
      experienceMin: data.experienceMin ?? this.experienceMin,
      experienceMax: data.experienceMax ?? this.experienceMax,
      location: {
        city: data.location?.city ?? this.location.city,
        state: data.location?.state ?? this.location.state,
        country: data.location?.country ?? this.location.country,
      },
      isRemote: data.isRemote ?? this.isRemote,
      jobType: data.jobType ?? this.jobType,
      salary: {
        min: data.salary?.min ?? this.salary.min,
        max: data.salary?.max ?? this.salary.max,
        currency: data.salary?.currency ?? this.salary.currency,
      },
      department: data.department ?? this.department,
      positions: data.positions ?? this.positions,
      expiresAt: data.expiresAt ?? this.expiresAt,
      externalLink: data.externalLink ?? this.externalLink,
    });
  }


  hide(): JobPost {
    return new JobPost({ ...this.toParams(), visibility: "hidden" });
  }

  unhide(): JobPost {
    return new JobPost({ ...this.toParams(), visibility: "active" });
  }

  isExpired(): boolean {
    return this.status === "expired";
  }

  isActive(): boolean {
    return this.status === "active";
  }

  isDraft(): boolean {
    return this.status === "draft";
  }

  isHidden(): boolean {
    return this.visibility === "hidden";
  }

  isBlockedByAdmin(): boolean {
    return this.isBlocked;
  }

  isPubliclyVisible(): boolean {
    return (
      this.visibility === "active" &&
      !this.isBlocked &&
      this.status === "active" &&
      !this.isDeleted
    );
  }

  publish():JobPost{
    return new JobPost({
      ...this.toParams(),
      status : "active",
      postedOn : new Date()
    })
  }

  private toParams() {
    return {
      id: this.id,
      recruiterId: this.recruiterId,
      title: this.title,
      description: this.description,
      responsibilities: this.responsibilities,
      requirements: this.requirements,
      requiredSkills: this.requiredSkills,
      preferredSkills: this.preferredSkills,
      experienceMin: this.experienceMin,
      experienceMax: this.experienceMax,
      location: this.location,
      isRemote: this.isRemote,
      jobType: this.jobType,
      salary: this.salary,
      department: this.department,
      positions: this.positions,
      visibility: this.visibility,
      isBlocked: this.isBlocked,
      status: this.status,
      views: this.views,
      applicationsCount: this.applicationsCount,
      isDeleted: this.isDeleted,
      postedOn: this.postedOn,
      expiresAt: this.expiresAt,
      externalLink: this.externalLink,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}