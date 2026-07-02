import type { Job } from "../types/job.types";
import type {
  JobApiProps,
  WrappedJobResponse,
} from "../types/jobPostApiResponse";

export type JobResponse = JobApiProps | WrappedJobResponse;

export const unwrapJob = (raw: JobResponse): Job => {
  const data = "props" in raw ? raw.props : raw;

  const id = data.id ?? data._id;

  if (!id) {
    throw new Error("Job id missing");
  }

  return {
    id,
    recruiterId: data.recruiterId,
    companyName: data.companyName,
    title: data.title,
    description: data.description,
    responsibilities: data.responsibilities,
    requirements: data.requirements,
    requiredSkills: data.requiredSkills,
    preferredSkills: data.preferredSkills,
    experienceMin: data.experienceMin,
    experienceMax: data.experienceMax,
    location: data.location,
    isRemote: data.isRemote,
    jobType: data.jobType,
    salary: data.salary,
    department: data.department,
    positions: data.positions ?? 0,
    visibility: data.visibility,
    isBlocked: data.isBlocked ?? false,
    status: data.status,
    views: data.views ?? 0,
    applicationsCount: data.applicationsCount ?? 0,
    publicationCount: data.publicationCount ?? 0,
    isDeleted: data.isDeleted ?? false,
    externalLink: data.externalLink,
    postedOn: data.postedOn ? new Date(data.postedOn) : undefined,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
  };
};
