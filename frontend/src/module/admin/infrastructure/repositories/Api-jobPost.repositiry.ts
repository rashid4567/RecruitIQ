import api from "@/api/axios";
import type { GetJobPostsQuery } from "../../application/dto/jobpost-query";
import { JobPostEntity } from "../../domain/entities/jobpost.entity";
import type { JobPostRepository } from "../../domain/repositories/jobPost.repository";
import type { JobPostApiDto } from "../dto/jobPost.api.dto";

function mapDtoToJobPost(dto: JobPostApiDto): JobPostEntity {
  return new JobPostEntity({
    id: dto.id,
    recruiterId: dto.recruiterId,
    title: dto.title,
    department: dto.department,
    jobType: dto.jobType,
    status: dto.status,
    isBlocked: dto.isBlocked,
    location: dto.location,
    isRemote: dto.isRemote,
    salary: dto.salary,
    requiredSkills: dto.requiredSkills ?? [],
    preferredSkills: dto.preferredSkills ?? [],
    experienceMin: dto.experienceMin,
    experienceMax: dto.experienceMax,
    positions: dto.positions,
    applicationsCount: dto.applicationsCount,
    views: dto.views,
    postedOn: dto.postedOn,
    expiresAt: dto.expiresAt,
    createdAt: dto.createdAt,
  });
}

export class ApiJobPostRepository implements JobPostRepository {

  async getJobPosts(query: GetJobPostsQuery): Promise<{
    jobPosts: JobPostEntity[];
    total: number;
  }> {
    const { data } = await api.get("/admin/job-posts", { params: query });

  
    const payload = data.data;
    const jobPosts: JobPostApiDto[] = payload?.jobPosts ?? payload?.data ?? [];
    const total: number = payload?.pagination?.total ?? 0;

    return {
      jobPosts: jobPosts.map(mapDtoToJobPost),
      total,
    };
  }

  async getJobPostById(jobPostId: string): Promise<JobPostEntity> {
    const { data } = await api.get(`/admin/job-posts/${jobPostId}`);
    return mapDtoToJobPost(data.data);
  }

  async blockJobPost(jobPostId: string): Promise<void> {
  await api.patch(`/admin/job-posts/${jobPostId}/block`);
}

async unblockJobPost(jobPostId: string): Promise<void> {
  await api.patch(`/admin/job-posts/${jobPostId}/unblock`);
}
}