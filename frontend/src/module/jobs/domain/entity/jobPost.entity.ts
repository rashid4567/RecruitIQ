import type {
  LocationVO,
  SalaryVO,
} from "../../../recruiter/presentation/types/jobForm.types";

import type { JobStatus, JobType, JobVisibility } from "../dto/jobPost.dto";

import type { CreateJobDTO } from "../dto/jobPost.dto";

export class Job {
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
  public readonly publicationCount: number;
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
    publicationCount?: number;
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
    this.publicationCount = params.publicationCount ?? 0;
    this.isDeleted = params.isDeleted ?? false;
    this.postedOn = params.postedOn;
    this.expiresAt = params.expiresAt;
    this.externalLink = params.externalLink;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  update(data: Partial<CreateJobDTO>): Job {
    return new Job({
      ...this.toParams(),
      ...data,
      location: {
        city: data.location?.city ?? this.location.city,
        state: data.location?.state ?? this.location.state,
        country: data.location?.country ?? this.location.country,
      },

      salary: {
        min: data.salary?.min ?? this.salary.min,
        max: data.salary?.max ?? this.salary.max,
        currency: data.salary?.currency ?? this.salary.currency,
      },
    });
  }

  publish(): Job {
    const now = new Date();

    return new Job({
      ...this.toParams(),
      status: "active",
      visibility: "active",
      postedOn: now,
      updatedAt: now,
      publicationCount: this.publicationCount + 1,
    });
  }
  isRepublishable(): boolean {
    return this.status === "expired";
  }

  hide(): Job {
    return new Job({
      ...this.toParams(),
      visibility: "hidden",
    });
  }

  unhide(): Job {
    return new Job({
      ...this.toParams(),
      visibility: "active",
    });
  }

  block(): Job {
    return new Job({
      ...this.toParams(),
      isBlocked: true,
    });
  }

  unblock(): Job {
    return new Job({
      ...this.toParams(),
      isBlocked: false,
    });
  }

  softDelete(): Job {
    return new Job({
      ...this.toParams(),
      isDeleted: true,
      visibility: "hidden",
    });
  }

  restore(): Job {
    return new Job({
      ...this.toParams(),
      isDeleted: false,
    });
  }

  incrementViews(): Job {
    return new Job({
      ...this.toParams(),
      views: this.views + 1,
    });
  }

  incrementApplications(): Job {
    return new Job({
      ...this.toParams(),
      applicationsCount: this.applicationsCount + 1,
    });
  }
  belongsToRecruiter(recruiterId: string): boolean {
    return this.recruiterId === recruiterId;
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
      publicationCount: this.publicationCount,
      isDeleted: this.isDeleted,
      postedOn: this.postedOn,
      expiresAt: this.expiresAt,
      externalLink: this.externalLink,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
