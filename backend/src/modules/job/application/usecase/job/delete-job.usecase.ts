import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { DeleteJobPostRequestDTO } from "../../dto/deleteJob.Dto";

export class DeleteJobUseCase implements IUseCase<
  DeleteJobPostRequestDTO,
  void
> {
  constructor(private readonly jobRepo: JobRepository) {}
  async execute(request: DeleteJobPostRequestDTO): Promise<void> {
    if (!request.jobId) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (!request.recruiterId) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_NOT_FOUND);
    }

    const job = await this.jobRepo.findById(request.jobId);

    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (!job.belongsToRecruiter(request.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    if (job.isDeleted()) {
      return;
    }

    job.softDelete();

    await this.jobRepo.save(job);
  }
}
