import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import {
  JobApplicationRepository,
  RecruiterApplicationListItem,
} from "../../../domain/repository/job-application.repository";

export class GetApplicationsByJobUseCase {
  constructor(private readonly applicationRepo: JobApplicationRepository) {}

  async execute(jobId: string): Promise<RecruiterApplicationListItem[]> {
    if (!jobId?.trim()) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    return this.applicationRepo.findApplicationsWithCandidateDetails(jobId);
  }
}
