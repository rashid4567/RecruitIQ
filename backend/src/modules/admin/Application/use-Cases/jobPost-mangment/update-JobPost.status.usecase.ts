import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobPost } from "../../../Domain/entities/jobPost-entity";
import { JobPostRepostory } from "../../../Domain/repositories/jobPost-repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";

export class BlockJobPostUseCase {
  constructor(private readonly repo: JobPostRepostory) {}

  async execute(id: string): Promise<JobPost> {
    if (!id) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_ID_NOT_FOUND)
    }

    const jobPost = await this.repo.findById(id);

    if (!jobPost) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND)
    }

    if (jobPost.isBlockedJob()) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_ALREADY_BLOCKED)
    }

    return this.repo.updateStatus(id, true);
  }
}

export class UnblockJobPostUseCase {
  constructor(private readonly repo: JobPostRepostory) {}

  async execute(id: string): Promise<JobPost> {
    if (!id) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_ID_NOT_FOUND)
    }

    const jobPost = await this.repo.findById(id);

    if (!jobPost) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND)
    }

    if (!jobPost.isBlockedJob()) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_IS_NOT_BLOCKED)
    }

    return this.repo.updateStatus(id, false);
  }
}