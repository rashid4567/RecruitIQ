import api from "@/api/axios";
import type { JobPostRepository } from "../../Domain/repositories/jobPost.Repository";
import type { CreateJobPostDTO } from "../../Domain/dto/jobPost.dto";
import { JobPost } from "../../Domain/entities/jobPost.entity";
import type { UpdateJobPostDTO } from "../../Domain/dto/updateJobPost.dto";

export class ApiJobPostRepository implements JobPostRepository {
  async createJobPost(data: CreateJobPostDTO): Promise<JobPost> {
    const res = await api.post("/recruiter/jobs/create", data);
    return this.toEntity(res.data.data);
  }

  async getJobPosts(): Promise<JobPost[]> {
    const res = await api.get("/recruiter/jobs");

    return res.data.data.map((job: any) => this.toEntity(job));
  }

  async getJobPostById(id: string): Promise<JobPost> {
    const res = await api.get(`/recruiter/jobs/${id}`);
    if(!res.data.data){
        throw new Error("Job not found")
    }
    return this.toEntity(res.data.data);
  }

  async updateJobPost(id: string, data: UpdateJobPostDTO): Promise<JobPost> {
    const res = await api.patch(`/recruiter/jobs/${id}`, data);
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

      status: data.status,

      postedOn: data.postedOn,
      expiresAt: data.expiresAt,
      externalLink: data.externalLink,

      views: data.views,
      applicationsCount: data.applicationsCount,

      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
