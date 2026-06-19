import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { GetJobByIdRequestDTO } from "../../dto/getJobPostById.dto";

export class GetJobByIdUseCase implements UseCase<GetJobByIdRequestDTO, Job> {
  constructor(private readonly repo: JobRepository) {}

  async execute(input: GetJobByIdRequestDTO): Promise<Job> {
    const { jobId, incrementView = false } = input;

    if (!jobId?.trim()) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    const job = await this.repo.findById(jobId);
    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (incrementView) {
      job.incrementViews();
      await this.repo.save(job);
    }
    return job;
  }
}
