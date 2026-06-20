import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { BlockJobPostRequestDTO } from "../../dto/job.status.dto";

export class BlockJobUseCase implements UseCase<BlockJobPostRequestDTO, Job> {
  constructor(private readonly repo: JobRepository) {}

  async execute(request: BlockJobPostRequestDTO): Promise<Job> {
    if (!request.jobId) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }
    const job = await this.repo.findById(request.jobId);

    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }
    job.block();

    return await this.repo.save(job);
  }
}
