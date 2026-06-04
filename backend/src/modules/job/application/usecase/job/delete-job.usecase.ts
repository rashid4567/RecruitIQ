import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { ERROR_CODES } from "../../../../recruiter/application/constants/error.code.constants";

export class DeleteJobUseCase {
  constructor(private readonly jobRepo: JobRepository) {}
  async execute(jobId: string, recruiterId: string): Promise<void> {
    if (!jobId) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (!recruiterId) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_NOT_FOUND);
    }

    const job = await this.jobRepo.findById(jobId);

    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (!job.belongsToRecruiter(recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    if (job.isDeleted()) {
      return;
    }

    job.softDelete();

    await this.jobRepo.save(job);
  }
}
