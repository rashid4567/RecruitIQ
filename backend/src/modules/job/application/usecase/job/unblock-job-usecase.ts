import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";

export class UnblockJobUseCase {
  constructor(private readonly repo: JobRepository) {}

  async execute(jobId: string): Promise<Job> {
    const job = await this.repo.findById(jobId);

    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    job.unblock();
    return await this.repo.save(job);
  }
}
