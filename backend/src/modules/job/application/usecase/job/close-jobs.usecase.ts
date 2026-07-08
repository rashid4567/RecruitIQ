import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";

import { JobRepository } from "../../../domain/repositories/job.repository";
import { CloseJobRequest } from "../../dto/close.jobs.dto";

import { JobApplicationRepository } from "../../../../job-application/domain/repository/job-application.repository";

export class CloseJobsUseCase implements IUseCase<CloseJobRequest, void> {
  constructor(
    private readonly jobRepo: JobRepository,
    private readonly applicationRepo: JobApplicationRepository,
  ) {}

  async execute(input: CloseJobRequest): Promise<void> {
    const { jobId, recruiterId } = input;

    const job = await this.jobRepo.findById(jobId);

    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_NOT_FOUND);
    }

    if (!job.belongsToRecruiter(recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED);
    }

    if (job.isBlocked) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_IS_BLOCKED_BY_ADMIN);
    }

    if (job.isDeleted()) {
      throw new ApplicationError(ERROR_CODES.JOB_DELETED);
    }

    if (job.status === "expired") {
      throw new ApplicationError(ERROR_CODES.JOB_ALREADY_EXPIRED);
    }

    job.expire();
    await this.jobRepo.save(job);
    const applications = await this.applicationRepo.findByJob(jobId);

    for (const application of applications) {
      if (application.canReject()) {
        application.reject("This job has been closed by the recruiter.");

        await this.applicationRepo.save(application);
      }
    }
  }
}
