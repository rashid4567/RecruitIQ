// export type JobType = "full-time" | "part-time" | "contract" | "internship";

// export interface JobLocation {
//   city: string;
//   state: string;
//   country: string;
// }

// export interface JobSalary {
//   min: number;
//   max: number;
//   currency: string;
// }

// export interface JobPostSummaryApiResponse {
//   id: string;
//   title: string;
//   department: string;
//   jobType: JobType;
//   location: JobLocation;
//   isRemote: boolean;
//   salary: JobSalary;
//   requiredSkills: string[];
//   experienceMin: number;
//   experienceMax: number;
//   positions: number;
//   applicationsCount: number;
//   postedOn?: string;
//   expiresAt?: string;
// }

// export interface JobPostDetailApiResponse extends JobPostSummaryApiResponse {
//   description: string;
//   responsibilities: string[];
//   requirements: string[];
//   preferredSkills: string[];
//   externalLink?: string;
//   views: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface PaginatedJobPostsApiResponse {
//   data: JobPostSummaryApiResponse[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export class JobPost {
//   public readonly id: string;
//   public readonly title: string;
//   public readonly department: string;
//   public readonly jobType: JobType;
//   public readonly location: JobLocation;
//   public readonly isRemote: boolean;
//   public readonly salary: JobSalary;
//   public readonly requiredSkills: string[];
//   public readonly experienceMin: number;
//   public readonly experienceMax: number;
//   public readonly positions: number;
//   public readonly applicationsCount: number;
//   public readonly postedOn?: string;
//   public readonly expiresAt?: string;

//   public readonly description?: string;
//   public readonly responsibilities?: string[];
//   public readonly requirements?: string[];
//   public readonly preferredSkills?: string[];
//   public readonly externalLink?: string;
//   public readonly views?: number;
//   public readonly createdAt?: string;
//   public readonly updatedAt?: string;

//   constructor(params: {
//     id: string;
//     title: string;
//     department: string;
//     jobType: JobType;
//     location: JobLocation;
//     isRemote: boolean;
//     salary: JobSalary;
//     requiredSkills: string[];
//     experienceMin: number;
//     experienceMax: number;
//     positions: number;
//     applicationsCount: number;
//     postedOn?: string;
//     expiresAt?: string;

//     description?: string;
//     responsibilities?: string[];
//     requirements?: string[];
//     preferredSkills?: string[];
//     externalLink?: string;
//     views?: number;
//     createdAt?: string;
//     updatedAt?: string;
//   }) {
//     this.id = params.id;
//     this.title = params.title;
//     this.department = params.department;
//     this.jobType = params.jobType;
//     this.location = params.location;
//     this.isRemote = params.isRemote;
//     this.salary = params.salary;
//     this.requiredSkills = params.requiredSkills;
//     this.experienceMin = params.experienceMin;
//     this.experienceMax = params.experienceMax;
//     this.positions = params.positions;
//     this.applicationsCount = params.applicationsCount;
//     this.postedOn = params.postedOn;
//     this.expiresAt = params.expiresAt;

//     this.description = params.description;
//     this.responsibilities = params.responsibilities;
//     this.requirements = params.requirements;
//     this.preferredSkills = params.preferredSkills;
//     this.externalLink = params.externalLink;
//     this.views = params.views;
//     this.createdAt = params.createdAt;
//     this.updatedAt = params.updatedAt;
//   }

//   static fromApi(data: JobPostSummaryApiResponse): JobPost {
//     if (!data?.id || !data?.title) {
//       throw new Error(
//         `Invalid job post API response shape: ${JSON.stringify(data)}`,
//       );
//     }

//     return new JobPost({
//       id: data.id,
//       title: data.title.trim(),
//       department: data.department ?? "",
//       jobType: data.jobType,
//       location: {
//         city: data.location?.city ?? "",
//         state: data.location?.state ?? "",
//         country: data.location?.country ?? "",
//       },
//       isRemote: data.isRemote ?? false,
//       salary: {
//         min: data.salary?.min ?? 0,
//         max: data.salary?.max ?? 0,
//         currency: data.salary?.currency ?? "INR",
//       },
//       requiredSkills: data.requiredSkills ?? [],
//       experienceMin: data.experienceMin ?? 0,
//       experienceMax: data.experienceMax ?? 0,
//       positions: data.positions ?? 1,
//       applicationsCount: data.applicationsCount ?? 0,
//       postedOn: data.postedOn ?? undefined,
//       expiresAt: data.expiresAt ?? undefined,
//     });
//   }

//   static fromDetailApi(data: JobPostDetailApiResponse): JobPost {
//     if (!data?.id || !data?.title) {
//       throw new Error(
//         `Invalid job post detail API response shape: ${JSON.stringify(data)}`,
//       );
//     }

//     return new JobPost({
//       id: data.id,
//       title: data.title.trim(),
//       department: data.department ?? "",
//       jobType: data.jobType,
//       location: {
//         city: data.location?.city ?? "",
//         state: data.location?.state ?? "",
//         country: data.location?.country ?? "",
//       },
//       isRemote: data.isRemote ?? false,
//       salary: {
//         min: data.salary?.min ?? 0,
//         max: data.salary?.max ?? 0,
//         currency: data.salary?.currency ?? "INR",
//       },
//       requiredSkills: data.requiredSkills ?? [],
//       experienceMin: data.experienceMin ?? 0,
//       experienceMax: data.experienceMax ?? 0,
//       positions: data.positions ?? 1,
//       applicationsCount: data.applicationsCount ?? 0,
//       postedOn: data.postedOn ?? undefined,
//       expiresAt: data.expiresAt ?? undefined,

//       description: data.description,
//       responsibilities: data.responsibilities ?? [],
//       requirements: data.requirements ?? [],
//       preferredSkills: data.preferredSkills ?? [],
//       externalLink: data.externalLink ?? undefined,
//       views: data.views ?? 0,
//       createdAt: data.createdAt,
//       updatedAt: data.updatedAt,
//     });
//   }

//   isExpired(): boolean {
//     if (!this.expiresAt) return false;
//     return new Date(this.expiresAt).getTime() < Date.now();
//   }

//   formatSalary(): string {
//     const formatter = new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: this.salary.currency,
//       maximumFractionDigits: 0,
//     });
//     return `${formatter.format(this.salary.min)} – ${formatter.format(this.salary.max)}`;
//   }

//   formatExperience(): string {
//     if (this.experienceMin === 0 && this.experienceMax === 0) return "Fresher";
//     if (this.experienceMin === this.experienceMax)
//       return `${this.experienceMin} yr${this.experienceMin !== 1 ? "s" : ""}`;
//     return `${this.experienceMin}–${this.experienceMax} yrs`;
//   }

//   formatLocation(): string {
//     if (this.isRemote && !this.location.city) return "Remote";
//     const base = [this.location.city, this.location.state]
//       .filter(Boolean)
//       .join(", ");
//     return this.isRemote ? `${base} · Remote` : base;
//   }

//   postedAgo(): string {
//     if (!this.postedOn) return "";
//     const diff = Date.now() - new Date(this.postedOn).getTime();
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     if (days === 0) return "Today";
//     if (days === 1) return "Yesterday";
//     if (days < 7) return `${days} days ago`;
//     if (days < 30) return `${Math.floor(days / 7)}w ago`;
//     return `${Math.floor(days / 30)}mo ago`;
//   }

//   jobTypeLabel(): string {
//     const map: Record<JobType, string> = {
//       "full-time": "Full-time",
//       "part-time": "Part-time",
//       contract: "Contract",
//       internship: "Internship",
//     };
//     return map[this.jobType];
//   }
// }
