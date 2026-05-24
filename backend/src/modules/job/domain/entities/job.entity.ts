import { DomainError } from "../errors/domain.error";
import { JOB_ERRORS } from "../errors/job.error.codes";

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

export interface JobProps {
  id?: string;
  recruiterId: string;
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
  views: number;
  applicationsCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Job {
  private constructor(private props: JobProps) {
    this.validate();
  }

  static create(
    props: Omit<
      JobProps,
      | "id"
      | "visibility"
      | "isBlocked"
      | "status"
      | "postedOn"
      | "views"
      | "applicationsCount"
      | "isDeleted"
      | "createdAt"
      | "updatedAt"
    >,
  ): Job {
    return new Job({
      ...props,
      visibility: "active",
      isBlocked: false,
      status: "draft",
      postedOn: undefined,
      views: 0,
      applicationsCount: 0,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static rehydrate(props: JobProps): Job {
    return new Job(props);
  }

  private validate() {
    if (!this.props.title?.trim()) {
      throw new DomainError(JOB_ERRORS.TITLE_REQUIRED);
    }

    if (!this.props.description?.trim()) {
      throw new DomainError(JOB_ERRORS.DESCRIPTION_REQUIRED);
    }

    const salary = this.props.salary ?? {
      min: 0,
      max: 0,
      currency: "INR",
    };

    if (salary.min < 0 || salary.max < 0) {
      throw new DomainError(JOB_ERRORS.INVALID_SALARY);
    }

    if (salary.min > salary.max) {
      throw new DomainError(JOB_ERRORS.INVALID_SALARY);
    }

    if (this.props.experienceMin < 0 || this.props.experienceMax < 0) {
      throw new DomainError(JOB_ERRORS.INVALID_EXPERIENCE);
    }

    if (this.props.experienceMin > this.props.experienceMax) {
      throw new DomainError(JOB_ERRORS.INVALID_EXPERIENCE);
    }

    if (this.props.positions <= 0) {
      throw new DomainError(JOB_ERRORS.INVALID_POSITION);
    }
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  private ensureEditable() {
    if (this.props.isDeleted) {
      throw new DomainError(JOB_ERRORS.JOB_DELETED);
    }
    if (this.props.isBlocked) {
      throw new DomainError(JOB_ERRORS.JOB_BLOCKED);
    }
  }

  get id() {
    return this.props.id;
  }

  get recruiterId() {
    return this.props.recruiterId;
  }

  get status() {
    return this.props.status;
  }

  get visibility() {
    return this.props.visibility;
  }

  get isBlocked() {
    return this.props.isBlocked;
  }

  get views() {
    return this.props.views;
  }

  get applicationsCount() {
    return this.props.applicationsCount;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get location() {
    return this.props.location;
  }

  get salary() {
    return this.props.salary;
  }

  get department() {
    return this.props.department;
  }

  publish() {
    this.ensureEditable();

    if (this.props.expiresAt && this.props.expiresAt < new Date()) {
      this.props.expiresAt = undefined;
    }
    this.props.status = "active";
    this.props.visibility = "active";
    this.props.postedOn = new Date();
    this.touch();
  }

  expire() {
    this.props.status = "expired";
    this.props.visibility = "hidden";
    this.touch();
  }

  hide() {
    this.props.visibility = "hidden";
    this.touch();
  }

  unhide() {
    if (this.props.isDeleted) {
      throw new DomainError(JOB_ERRORS.JOB_DELETED);
    }
    if (this.props.isBlocked) {
      throw new DomainError(JOB_ERRORS.JOB_BLOCKED);
    }
    this.props.visibility = "active";
    this.touch();
  }

  block() {
    if (this.props.isDeleted) {
      throw new DomainError(JOB_ERRORS.JOB_DELETED);
    }
    this.props.isBlocked = true;
    this.props.visibility = "hidden";
    this.touch();
  }

  unblock() {
    if (this.props.isDeleted) {
      throw new DomainError(JOB_ERRORS.JOB_DELETED);
    }

    this.props.isBlocked = false;
    if (this.props.status === "active") {
      this.props.visibility = "active";
    }
    this.touch();
  }

  softDelete() {
    this.props.isDeleted = true;
    this.props.visibility = "hidden";
    this.touch();
  }

  restoreDeleted() {
    this.props.isDeleted = false;

    if (!this.props.isBlocked) {
      this.props.visibility = "active";
    }
    this.touch();
  }

  incrementViews() {
    this.props.views++;
    this.touch();
  }

  incrementApplications() {
    this.props.applicationsCount++;
    this.touch();
  }

  updateJobType(type: JobType) {
    this.ensureEditable();
    this.props.jobType = type;
    this.touch();
  }

  updateDepartment(department: string) {
    this.ensureEditable();
    this.props.department = department;
    this.touch();
  }

  updatePositions(positions: number) {
    this.ensureEditable();
    if (positions <= 0) {
      throw new DomainError(JOB_ERRORS.INVALID_POSITION);
    }
    this.props.positions = positions;
    this.touch();
  }

  updateRemoteStatus(value: boolean) {
    this.ensureEditable();
    this.props.isRemote = value;
    this.touch();
  }

  updateExpiryDate(date: Date) {
    this.ensureEditable();
    this.props.expiresAt = date;
    this.touch();
  }

  updateExternalLink(link?: string) {
    this.ensureEditable();
    this.props.externalLink = link;
    this.touch();
  }

  canApply() {
    return this.isVisibleToCandidate();
  }

  canPublish() {
    return !this.props.isBlocked && !this.props.isDeleted;
  }

  belongsToRecruiter(recruiterId: string) {
    return this.props.recruiterId === recruiterId;
  }

  requiresAdminReview() {
    return this.props.isBlocked;
  }

  isExpired() {
    if (!this.props.expiresAt) {
      return false;
    }
    return this.props.expiresAt < new Date();
  }

  isDeleted() {
    return this.props.isDeleted;
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
    location?: JobLocation;
    salary?: JobSalary;
    department?: string;
    positions?: number;
    isRemote?: boolean;
    jobType?: JobType;
    externalLink?: string;
    expiresAt?: Date;
  }) {
    this.ensureEditable();

    if (data.title !== undefined) {
      this.props.title = data.title;
    }
    if (data.description !== undefined) {
      this.props.description = data.description;
    }
    if (data.responsibilities !== undefined) {
      this.props.responsibilities = data.responsibilities;
    }
    if (data.requirements !== undefined) {
      this.props.requirements = data.requirements;
    }
    if (data.requiredSkills !== undefined) {
      this.props.requiredSkills = data.requiredSkills;
    }
    if (data.preferredSkills !== undefined) {
      this.props.preferredSkills = data.preferredSkills;
    }
    if (data.experienceMin !== undefined) {
      this.props.experienceMin = data.experienceMin;
    }
    if (data.experienceMax !== undefined) {
      this.props.experienceMax = data.experienceMax;
    }
    if (data.location !== undefined) {
      this.props.location = data.location;
    }
    if (data.salary !== undefined) {
      this.props.salary = data.salary;
    }
    if (data.department !== undefined) {
      this.props.department = data.department;
    }
    if (data.positions !== undefined) {
      if (data.positions <= 0) {
        throw new DomainError(JOB_ERRORS.INVALID_POSITION);
      }
      this.props.positions = data.positions;
    }
    if (data.isRemote !== undefined) {
      this.props.isRemote = data.isRemote;
    }

    if (data.jobType !== undefined) {
      this.props.jobType = data.jobType;
    }
    if (data.externalLink !== undefined) {
      this.props.externalLink = data.externalLink;
    }
    if (data.expiresAt !== undefined) {
      this.props.expiresAt = data.expiresAt;
    }

    this.validate();
    this.touch();
  }

  isVisibleToCandidate(): boolean {
    if (this.props.isDeleted) {
      return false;
    }

    if (this.props.isBlocked) {
      return false;
    }

    if (this.props.visibility !== "active") {
      return false;
    }

    /* recruiter not published */

    if (this.props.status !== "active") {
      return false;
    }

    /* date expired */

    if (this.props.expiresAt && this.props.expiresAt < new Date()) {
      return false;
    }

    return true;
  }
  candidateView() {
    return {
      id: this.props.id,

      title: this.props.title,

      description: this.props.description,

      responsibilities: this.props.responsibilities ?? [],

      requirements: this.props.requirements ?? [],

      requiredSkills: this.props.requiredSkills ?? [],

      preferredSkills: this.props.preferredSkills ?? [],

      experienceMin: this.props.experienceMin,

      experienceMax: this.props.experienceMax,

      location: this.props.location ?? {
        city: "",
        state: "",
        country: "",
      },

      salary: this.props.salary ?? {
        min: 0,
        max: 0,
        currency: "INR",
      },

      department: this.props.department ?? "",

      jobType: this.props.jobType,

      isRemote: this.props.isRemote,

      positions: this.props.positions,

      externalLink: this.props.externalLink,

      postedOn: this.props.postedOn,

      expiresAt: this.props.expiresAt,
    };
  }

  toObject() {
    return { ...this.props };
  }
}
