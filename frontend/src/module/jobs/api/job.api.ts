import api from "@/api/axios";
import type { Job } from "../types/job.types";
import type { JobPostFilters } from "../types/JobPostDTO"; 
import type { CreateJobDTO   } from "../types/jobPost.dto"; 
import type {
  JobApiProps,WrappedJobResponse
} from "../types/jobPostApiResponse"
import type { UpdateJobPostDTO } from "../types/updateJobPost.dto";

export type Role = "recruiter" | "candidate" | "admin";

type JobResponse = JobApiProps | WrappedJobResponse;

export interface PaginatedJobs {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginatedJobResponse {
  data: JobResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const unwrapJob = (raw: JobResponse): Job => {
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
    positions: data.positions,
    visibility: data.visibility,
    isBlocked: data.isBlocked,
    status: data.status,
    views: data.views,
    applicationsCount: data.applicationsCount,
    publicationCount: data.publicationCount ?? 0,
    isDeleted: data.isDeleted,
    externalLink: data.externalLink,
    postedOn: data.postedOn ? new Date(data.postedOn) : undefined,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
  };
};

export const createJob = async (
  role: Role,
  payload: CreateJobDTO,
): Promise<Job> => {
  const res = await api.post(`/${role}/jobs/create`, payload);

  return unwrapJob(res.data.data);
};

export const getJobs = async (
  role: Role,
  filters?: JobPostFilters,
): Promise<PaginatedJobs> => {
  const res = await api.get(`/${role}/jobs`, {
    params: {
      page: filters?.page,
      limit: filters?.limit,
      search: filters?.search,
      status: filters?.status,
      isBlocked: filters?.isBlocked,
      jobType: filters?.jobType,
      isRemote: filters?.isRemote,
      skills: filters?.skills,
      experienceMin: filters?.experienceMin,
      experienceMax: filters?.experienceMax,
      salaryMin: filters?.salaryMin,
      salaryMax: filters?.salaryMax,
      department: filters?.department,
    },
  });

  const response: PaginatedJobResponse = res.data.data;

  return {
    data: response.data.map(unwrapJob),
    total: response.total,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
  };
};

export const getJobById = async (role: Role, id: string): Promise<Job> => {
  const res = await api.get(`/${role}/jobs/${id}`);

  return unwrapJob(res.data.data);
};

export const updateJob = async (
  role: Role,
  id: string,
  job: UpdateJobPostDTO,
): Promise<Job> => {
  const res = await api.put(
    `/${role}/jobs/${id}`,
    job,
  );

  return unwrapJob(res.data.data);
};

export const publishJob = async (role: Role, id: string): Promise<Job> => {
  const res = await api.patch(`/${role}/jobs/${id}/publish`);

  return unwrapJob(res.data.data);
};

export const hideJob = async (role: Role, id: string): Promise<Job> => {
  const res = await api.patch(`/${role}/jobs/${id}/hide`);

  return unwrapJob(res.data.data);
};

export const unhideJob = async (role: Role, id: string): Promise<Job> => {
  const res = await api.patch(`/${role}/jobs/${id}/unhide`);

  return unwrapJob(res.data.data);
};

export const deleteJob = async (role: Role, id: string): Promise<void> => {
  await api.delete(`/${role}/jobs/${id}`);
};

export const blockJob = async (id: string): Promise<Job> => {
  const res = await api.patch(`/admin/jobs/${id}/block`);

  return unwrapJob(res.data.data);
};

export const unblockJob = async (id: string): Promise<Job> => {
  const res = await api.patch(`/admin/jobs/${id}/unblock`);

  return unwrapJob(res.data.data);
};
