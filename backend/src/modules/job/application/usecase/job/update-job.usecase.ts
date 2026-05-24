import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../recruiter/application/constants/error.code.constants";
import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { UpdateJobDTO } from "../../dto/update-job.dto";

export class UpdateJobUseCase {
  constructor(private readonly repo: JobRepository) {}

  async execute(
    jobId: string,
    recruiterId: string,
    dto: UpdateJobDTO,
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
    job.update(dto);
    return await this.repo.save(job);
  }
}
