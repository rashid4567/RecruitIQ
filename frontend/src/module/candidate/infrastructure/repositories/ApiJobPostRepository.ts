import api from "@/api/axios";

import type {
  JobPostFilters,
  PaginatedJobPosts,
} from "../../domain/dto/JobPostDTO";
import type { JobPostApiDto } from "@/module/admin/infrastructure/dto/jobPost.api.dto";

import { JobPost } from "../../domain/entities/jobPost";
import type { jobPostRepository } from "../../domain/repositories/jobPost.Repository";

export class ApiJobPostRepository implements jobPostRepository {
  async getAll(filters: JobPostFilters): Promise<PaginatedJobPosts> {
    const params = this.buildParams(filters);
    const res = await api.get("/candidate/jobs", { params });

    const { data, total, page, limit, totalPages } = res.data;

    return {
      data: data.map((item: JobPostApiDto) => JobPost.fromApi(item)),
      total,
      page,
      limit,
      totalPages,
    };
  }
  async getById(id: string): Promise<JobPost> {
    const res = await api.get(`/candidate/jobs/${id}`);
    return JobPost.fromDetailApi(res.data.data);
  }

  private buildParams(filters: JobPostFilters): Record<string, string> {
    return Object.fromEntries(
      Object.entries({
        page: filters.page !== undefined ? String(filters.page) : undefined,
        limit: filters.limit !== undefined ? String(filters.limit) : undefined,
        search: filters.search?.trim() || undefined,
        jobType: filters.jobType || undefined,
        isRemote:
          typeof filters.isRemote === "boolean"
            ? String(filters.isRemote)
            : undefined,
        skills: filters.skills?.length ? filters.skills.join(",") : undefined,
        experienceMin:
          typeof filters.experienceMin === "number"
            ? String(filters.experienceMin)
            : undefined,
        experienceMax:
          typeof filters.experienceMax === "number"
            ? String(filters.experienceMax)
            : undefined,
        salaryMin:
          typeof filters.salaryMin === "number"
            ? String(filters.salaryMin)
            : undefined,
        salaryMax:
          typeof filters.salaryMax === "number"
            ? String(filters.salaryMax)
            : undefined,
        department: filters.department || undefined,
      } as Record<string, string | undefined>).filter(
        ([, v]) => v !== undefined,
      ),
    ) as Record<string, string>;
  }
}
