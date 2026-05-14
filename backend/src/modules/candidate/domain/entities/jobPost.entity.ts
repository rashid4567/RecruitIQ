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

export interface JobPostProps {
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

export class JobPostEntity {
  private readonly props: JobPostProps;
  private constructor(props: JobPostProps) {
    this.validate(props);
    this.props = Object.freeze(props);
  }
  static create(props: JobPostProps): JobPostEntity {
    return new JobPostEntity(props);
  }
  private validate(props: JobPostProps) {
    if (!props.title) throw new Error("Job title is required");

    if (props.salary.min > props.salary.max) {
      throw new Error("Invalid salary range");
    }

    if (props.experienceMin > props.experienceMax) {
      throw new Error("Invalid experience range");
    }
  }

  get id() {
    return this.props.id;
  }
  get recruiterId() {
    return this.props.recruiterId;
  }
  get title() {
    return this.props.title;
  }
  get description() {
    return this.props.description;
  }
  get responsibilities() {
    return this.props.responsibilities;
  }
  get requirements() {
    return this.props.requirements;
  }
  get requiredSkills() {
    return this.props.requiredSkills;
  }
  get preferredSkills() {
    return this.props.preferredSkills;
  }
  get experienceMin() {
    return this.props.experienceMin;
  }
  get experienceMax() {
    return this.props.experienceMax;
  }
  get location() {
    return this.props.location;
  }
  get isRemote() {
    return this.props.isRemote;
  }
  get jobType() {
    return this.props.jobType;
  }
  get salary() {
    return this.props.salary;
  }
  get department() {
    return this.props.department;
  }
  get positions() {
    return this.props.positions;
  }
  get visibility() {
    return this.props.visibility;
  }
  get isBlocked() {
    return this.props.isBlocked;
  }
  get status() {
    return this.props.status;
  }
  get postedOn() {
    return this.props.postedOn;
  }
  get expiresAt() {
    return this.props.expiresAt;
  }
  get externalLink() {
    return this.props.externalLink;
  }
  get views() {
    return this.props.views;
  }
  get applicationsCount() {
    return this.props.applicationsCount;
  }
  get isDeleted() {
    return this.props.isDeleted;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  isExpired(): boolean {
    if (!this.props.expiresAt) return false;
    return this.props.expiresAt.getTime() < Date.now();
  }

  isVisibleToCandidate(): boolean {
    return (
      this.props.status === "active" &&
      this.props.visibility === "active" &&
      !this.props.isBlocked &&
      !this.props.isDeleted &&
      !this.isExpired()
    );
  }

  canBeEdited(): boolean {
    return !this.props.isDeleted && !this.isExpired();
  }

  toCandidateView() {
    return {
      id: this.id,
      title: this.title,
      location: `${this.location.city}, ${this.location.state}`,
      salary: `${this.salary.min}-${this.salary.max} ${this.salary.currency}`,
      skills: this.requiredSkills,
      postedOn: this.postedOn,
    };
  }

  toObject(): JobPostProps {
    return { ...this.props };
  }
}
