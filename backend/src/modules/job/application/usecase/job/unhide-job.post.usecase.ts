import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { UnHideJobPostRequestDTO } from "../../dto/job.status.dto";

export class UnhideJobUseCase implements IUseCase<UnHideJobPostRequestDTO,Job> {
  constructor(private readonly repo: JobRepository) {}

  async execute(
  request : UnHideJobPostRequestDTO
  ): Promise<Job> {
    if (!request.jobId) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }
    if (!request.recruiterId) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }
    const job = await this.repo.findById(request.jobId);
    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }
    if (!job.belongsToRecruiter(request.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }
    if (job.isDeleted()) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }
    job.unhide();
    return await this.repo.save(job);
  }
}
