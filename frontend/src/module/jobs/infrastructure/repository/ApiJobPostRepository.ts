import api from "@/api/axios";
import type {
  JobPostRepository,
  PaginatedJobs,
} from "../../domain/repositories/jobPost.Repository";
import type { CreateJobDTO } from "../../domain/dto/jobPost.dto";
import type { JobPostFilters } from "../../domain/dto/JobPostDTO";
import { Job } from "../../domain/entity/jobPost.entity";

import type {
  JobApiProps,
  WrappedJobResponse,
} from "../interface/jobPostApiResponse";

type JobResponse = JobApiProps | WrappedJobResponse;

type Role = "recruiter" | "candidate" | "admin";

interface PaginatedJobResponse {
  data: JobResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ApiJobPostRepository implements JobPostRepository {
  private readonly role: Role;
  constructor(role: Role = "recruiter") {
    this.role = role;
  }

  async createJobPost(data: CreateJobDTO): Promise<Job> {
    const res = await api.post(`/${this.role}/jobs/create`, data);
    return this.toEntity(res.data.data);
  }

  async getJobPosts(filters?: JobPostFilters): Promise<PaginatedJobs> {
    const res = await api.get(`/${this.role}/jobs`, {
      params: {
        page: filters?.page,
        limit: filters?.limit,
        search: filters?.search,
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
      data: response.data.map((job) => this.toEntity(job)),
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    };
  }

  async getJobPostById(id: string): Promise<Job> {
    const res = await api.get(`/${this.role}/jobs/${id}`);
    return this.toEntity(res.data.data);
  }

  async updateJobPost(id: string, job: Job): Promise<Job> {
    const res = await api.put(`/${this.role}/jobs/${id}`, {
      title: job.title,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      requiredSkills: job.requiredSkills,
      preferredSkills: job.preferredSkills,
      experienceMin: job.experienceMin,
      experienceMax: job.experienceMax,
      location: job.location,
      isRemote: job.isRemote,
      jobType: job.jobType,
      salary: job.salary,
      department: job.department,
      positions: job.positions,
      expiresAt: job.expiresAt,
      externalLink: job.externalLink,
    });
    return this.toEntity(res.data.data);
  }
  async hideJobPost(id: string): Promise<Job> {
    const res = await api.patch(`/${this.role}/jobs/${id}/hide`);
    return this.toEntity(res.data.data);
  }
  async unhideJobPost(id: string): Promise<Job> {
    const res = await api.patch(`/${this.role}/jobs/${id}/unhide`);
    return this.toEntity(res.data.data);
  }
  async publish(id: string): Promise<Job> {
    const res = await api.patch(`/${this.role}/jobs/${id}/publish`);
    return this.toEntity(res.data.data);
  }
  async deleteJobPost(id: string): Promise<void> {
    await api.delete(`/${this.role}/jobs/${id}`);
  }
  async blockJobPost(id: string): Promise<Job> {
    const res = await api.patch(`/admin/jobs/${id}/block`);
    return this.toEntity(res.data.data)
  }
  async unblockJobPost(id: string): Promise<Job> {
    const res = await api.patch(`/admin/jobs/${id}/unblock`);
    return this.toEntity(res.data.data);
  }
  private unwrap(raw: JobResponse): JobApiProps {
    if ("props" in raw) {
      return raw.props;
    }
    return raw;
  }

  private toEntity(raw: JobResponse): Job {
    const data = this.unwrap(raw);
    const id = data.id ?? data._id;

    if (!id) {
      throw new Error("Job id missing");
    }

    return new Job({
      id,
      recruiterId: data.recruiterId,
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
      isDeleted: data.isDeleted,
      externalLink: data.externalLink,
      postedOn: data.postedOn ? new Date(data.postedOn) : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    });
  }
}
