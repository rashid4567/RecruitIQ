import { JobPostEntity } from "../../../domain/entities/jobPost.entity";
import {
  CandidateJobPostRepository,
  FindAllJobPostOptions,
} from "../../../domain/repositories/candidatejobpost.repository";
import {
  GetAllJobPostsRequestDTO,
  JobPostSummaryDTO,
  PaginatedJobPostsResponseDTO,
} from "../../dto/jobPost.dto";

export class GetAllJobPostsUseCase {
  constructor(private readonly jobPostRepo: CandidateJobPostRepository) {}

  async execute(
    dto: GetAllJobPostsRequestDTO,
  ): Promise<PaginatedJobPostsResponseDTO> {
    const options: FindAllJobPostOptions = {
      page: dto.page ?? 1,
      limit: dto.limit ?? 10,
      search: dto.search,
      jobType: dto.jobType,
      isRemote: dto.isRemote,
      skills: dto.skills,
      experienceMin: dto.experienceMin,
      experienceMax: dto.experienceMax,
      salaryMin: dto.salaryMin,
      salaryMax: dto.salaryMax,
      department: dto.department,
    };

    const result = await this.jobPostRepo.findAll(options);

    return {
      data: result.data.map((job) => this.toSummaryDTO(job)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  private toSummaryDTO(job: JobPostEntity): JobPostSummaryDTO {
    return {
      id: job.id,
      title: job.title,
      department: job.department,
      jobType: job.jobType,
      location: {
        city: job.location.city,
        state: job.location.state,
        country: job.location.country,
      },
      isRemote: job.isRemote,
      salary: {
        min: job.salary.min,
        max: job.salary.max,
        currency: job.salary.currency,
      },
      requiredSkills: job.requiredSkills,
      experienceMin: job.experienceMin,
      experienceMax: job.experienceMax,
      positions: job.positions,
      applicationsCount: job.applicationsCount,
      postedOn: job.postedOn?.toISOString(),
      expiresAt: job.expiresAt?.toISOString(),
    };
  }
}
