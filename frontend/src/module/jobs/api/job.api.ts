import api from "@/api/axios";

import { JOB_ROUTES } from "../constant/job.routes";
import { unwrapJob, type JobResponse } from "../mappers/job.mapper";

import type { Job } from "../types/job.types";
import type { JobPostFilters } from "../types/JobPostDTO";
import type { CreateJobDTO } from "../types/jobPost.dto";
import type { UpdateJobPostDTO } from "../types/updateJobPost.dto";

export type Role = "recruiter" | "candidate" | "admin";

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

export const createJob = async (
  role: Role,
  payload: CreateJobDTO,
): Promise<Job> => {
  const res = await api.post(JOB_ROUTES.CREATE(role), payload);

  return unwrapJob(res.data.data);
};

export const getJobs = async (
  role: Role,
  filters?: JobPostFilters,
): Promise<PaginatedJobs> => {
  const res = await api.get(JOB_ROUTES.JOBS(role), {
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
  const res = await api.get(JOB_ROUTES.JOB(role, id));
  return unwrapJob(res.data.data);
};

export const updateJob = async (
  role: Role,
  id: string,
  payload: UpdateJobPostDTO,
): Promise<Job> => {
  const res = await api.put(JOB_ROUTES.JOB(role, id), payload);
  return unwrapJob(res.data.data);
};

export const publishJob = async (role: Role, id: string): Promise<Job> => {
  const res = await api.patch(JOB_ROUTES.PUBLISH(role, id));
  return unwrapJob(res.data.data);
};
export const hideJob = async (role: Role, id: string): Promise<Job> => {
  const res = await api.patch(JOB_ROUTES.HIDE(role, id));
  return unwrapJob(res.data.data);
};
export const unhideJob = async (role: Role, id: string): Promise<Job> => {
  const res = await api.patch(JOB_ROUTES.UNHIDE(role, id));
  return unwrapJob(res.data.data);
};
export const deleteJob = async (role: Role, id: string): Promise<void> => {
  await api.delete(JOB_ROUTES.JOB(role, id));
};
export const blockJob = async (id: string): Promise<Job> => {
  const res = await api.patch(JOB_ROUTES.BLOCK(id));
  return unwrapJob(res.data.data);
};
export const unblockJob = async (id: string): Promise<Job> => {
  const res = await api.patch(JOB_ROUTES.UNBLOCK(id));
  return unwrapJob(res.data.data);
};
