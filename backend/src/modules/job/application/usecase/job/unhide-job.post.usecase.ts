import { ERROR_CODES } from "../../../../../constants/errorcode.constants";

import { ApplicationError } from "../../../../../shared/errors/application.error";

import { Job } from "../../../domain/entities/job.entity";

import { JobRepository } from "../../../domain/repositories/job.repository";

export class UnhideJobUseCase {
  constructor(private readonly repo: JobRepository) {}

  async execute(
    jobId: string,

    recruiterId: string,
  ): Promise<Job> {
    if (!jobId) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (!recruiterId) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    const job = await this.repo.findById(jobId);

    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (!job.belongsToRecruiter(recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    if (job.isDeleted()) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    job.unhide();

    return await this.repo.save(job);
  }
}
