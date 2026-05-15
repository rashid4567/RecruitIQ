import api from "@/api/axios";
import type { JobPostRepository } from "../../Domain/repositories/jobPost.Repository";
import type { CreateJobPostDTO } from "../../Domain/dto/jobPost.dto";
import { JobPost } from "../../Domain/entities/jobPost.entity";
import type { JobPostApiResponse } from "../../Interface/jobPostApiResponse";

export class ApiJobPostRepository implements JobPostRepository {
  async createJobPost(data: CreateJobPostDTO): Promise<JobPost> {
    const res = await api.post("/recruiter/jobs/create", data);
    return this.toEntity(res.data.data);
  }

  async getJobPosts(): Promise<JobPost[]> {
    const res = await api.get("/recruiter/jobs");
    return res.data.data.map((job: JobPostApiResponse) => this.toEntity(job));
  }

  async getJobPostById(id: string): Promise<JobPost> {
    const res = await api.get(`/recruiter/jobs/${id}`);
    if (!res.data.data) {
      throw new Error("Job not found");
    }
    return this.toEntity(res.data.data);
  }

  async updateJobPost(id: string, job: JobPost): Promise<JobPost> {
    const res = await api.put(`/recruiter/jobs/${id}`, {
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

  async hideJobPost(id: string): Promise<JobPost> {
    const res = await api.patch(`/recruiter/jobs/${id}/hide`);
    return this.toEntity(res.data.data);
  }

  async unhideJobPost(id: string): Promise<JobPost> {
    const res = await api.patch(`/recruiter/jobs/${id}/unhide`);
    return this.toEntity(res.data.data);
  }

  async publish(id: string): Promise<JobPost> {
    const res = await api.patch(`/recruiter/jobs/${id}/publish`);
    return this.toEntity(res.data.data);
  }

  async deleteJobPost(id: string): Promise<void> {
    await api.delete(`/recruiter/jobs/${id}`);
  }

  private toEntity(data: any): JobPost {
    return new JobPost({
      id: data._id ?? data.id,
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
      visibility: data.visibility ?? "active",
      isBlocked: data.isBlocked ?? false,
      status: data.status,
      externalLink: data.externalLink,
      views: data.views,
      applicationsCount: data.applicationsCount,
      postedOn: data.postedOn ? new Date(data.postedOn) : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      isDeleted: data.isDeleted ?? false,
    });
  }
}
