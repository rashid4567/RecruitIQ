import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { JobApplicationRepository } from "../../../../job-application/domain/repository/job-application.repository";
import {
  PaginationOptions,
  PaginatedResult,
} from "../../../domain/types/job-filter.type";
import {
  GetJobsRequestDTO,
  CandidateJobResponse,
} from "../../dto/candidatejobpost.dto";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";

export class CandidateGetJobsUseCase implements IUseCase<
  GetJobsRequestDTO,
  PaginatedResult<CandidateJobResponse>
> {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  async execute(
    input: GetJobsRequestDTO,
  ): Promise<PaginatedResult<CandidateJobResponse>> {
    const { filters, page = 1, limit = 10, candidateId } = input;

    if (!candidateId) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND)
    }

    const pagination: PaginationOptions = {
      page,
      limit,
    };

    const jobs = await this.jobRepository.findAll(filters, pagination, {
      field: "createdAt",
      order: "desc",
    });

    const applications =
      await this.jobApplicationRepository.findByCandidate(candidateId);

    const appliedJobIds = new Set(
      applications.map((application) => application.jobId),
    );

    return {
      ...jobs,
      data: jobs.data.map((job) => ({
        ...job.toObject(),
        isApplied: appliedJobIds.has(job.id!),
      })),
    };
  }
}
