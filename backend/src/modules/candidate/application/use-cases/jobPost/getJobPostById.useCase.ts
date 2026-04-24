

import { JobPostEntity } from "../../../domain/entities/jobPost.entity";
import { CandidateJobPostRepository } from "../../../domain/repositories/candidatejobpost.repository";
import { GetJobPostByIdRequestDTO, JobPostDetailDTO } from "../../dto/jobPost.dto";

export class GetJobPostByIdUseCase {
  constructor(private readonly jobPostRepo: CandidateJobPostRepository) {}

  async execute(dto: GetJobPostByIdRequestDTO): Promise<JobPostDetailDTO> {
    const job = await this.jobPostRepo.findById(dto.id);

    if (!job) {
      throw new Error(`Job post not found`);
    }

    if (!job.isVisibleToCandidate()) {
      throw new Error(`Job post is not available`);
    }

    await this.jobPostRepo.incrementViews(dto.id);

    return this.toDetailDTO(job);
  }

  private toDetailDTO(job: JobPostEntity): JobPostDetailDTO {
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
      preferredSkills: job.preferredSkills,
      experienceMin: job.experienceMin,
      experienceMax: job.experienceMax,
      positions: job.positions,
      applicationsCount: job.applicationsCount,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      externalLink: job.externalLink,
      views: job.views,
      postedOn: job.postedOn?.toISOString(),
      expiresAt: job.expiresAt?.toISOString(),
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    };
  }
}