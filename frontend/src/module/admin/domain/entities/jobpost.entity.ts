

export type JobType = "full-time" | "part-time" | "contract" | "internship";
export type JobStatus = "draft" | "active" | "expired";
export type JobVisibility = "active" | "hidden";
export type JobPostStatus = "Active" | "Blocked";

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

export class JobPostEntity {
  public readonly id: string;
  public readonly recruiterId: string;
  public readonly title: string;
  public readonly department: string;
  public readonly jobType: JobType;
  public readonly status: JobStatus;
  public readonly isBlocked: boolean;
  public readonly location: JobLocation;
  public readonly isRemote: boolean;
  public readonly salary: JobSalary;
  public readonly requiredSkills: string[];
  public readonly preferredSkills: string[];
  public readonly experienceMin: number;
  public readonly experienceMax: number;
  public readonly positions: number;
  public readonly applicationsCount: number;
  public readonly views: number;
  public readonly postedOn?: string;
  public readonly expiresAt?: string;
  public readonly createdAt: string;
  constructor(params: {
    id: string;
    recruiterId: string;
    title: string;
    department: string;
    jobType: JobType;
    status: JobStatus;
    isBlocked: boolean;
    location: JobLocation;
    isRemote: boolean;
    salary: JobSalary;
    requiredSkills?: string[];
    preferredSkills?: string[];
    experienceMin?: number;
    experienceMax?: number;
    positions?: number;
    applicationsCount?: number;
    views?: number;
    postedOn?: string;
    expiresAt?: string;
    createdAt: string;
  }) {
    if (!params.id) {
      throw new Error("Jobpost id is required");
    }

    this.id = params.id;
    this.recruiterId = params.recruiterId;
    this.title = params.title;
    this.department = params.department;
    this.jobType = params.jobType;
    this.status = params.status;
    this.isBlocked = params.isBlocked;
    this.location = params.location;
    this.isRemote = params.isRemote;
    this.salary = params.salary;
    this.requiredSkills = params.requiredSkills ?? [];
    this.preferredSkills = params.preferredSkills ?? [];
    this.experienceMax = params.experienceMax ?? 0;
    this.experienceMin = params.experienceMin ?? 0;
    this.positions = params.positions ?? 1;
    this.applicationsCount = params.applicationsCount ?? 0;
    this.views = params.views ?? 0;
    this.postedOn = params.postedOn;
    this.expiresAt = params.expiresAt;
    this.createdAt = params.createdAt;
  }

  isActive():boolean{
    return this.status === "active" && !this.isBlocked;
  }

  isBlockedPost():boolean{
    return this.isBlocked;
  }

  isExpiredPost():boolean{
    return this.isBlocked;
  }

  isExpired():boolean{
    if(!this.expiresAt)return false;
    return new Date() > new Date(this.expiresAt);
  }

   salaryRange(): string {
    return `${this.salary.currency} ${this.salary.min.toLocaleString()} – ${this.salary.max.toLocaleString()}`;
  }

  locationLabel():string{
    if(this.isRemote)return "remote";
    const {city , state, country} = this.location;
    return [city, state, country].filter(Boolean).join("")
  }


  experienceRange():string{
    return `${this.experienceMin} - ${this.experienceMax}`
  }

  withBlocked(isBlocked : boolean):JobPostEntity{
    return new JobPostEntity({
        ...this,
        isBlocked,
    })
  }

}
