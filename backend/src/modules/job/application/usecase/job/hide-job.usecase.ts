import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { HideJobPostRequestDTO } from "../../dto/job.status.dto";

export class HideJobUseCase implements UseCase<HideJobPostRequestDTO, Job> {
  constructor(private readonly repo: JobRepository) {}

  async execute(request: HideJobPostRequestDTO): Promise<Job> {
    const job = await this.repo.findById(request.jobId);

    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (!job.belongsToRecruiter(request.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    job.hide();

    return await this.repo.save(job);
  }
}
