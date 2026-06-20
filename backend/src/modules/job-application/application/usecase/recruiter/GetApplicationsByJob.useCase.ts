import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  JobApplicationRepository,
  RecruiterApplicationListItem,
} from "../../../domain/repository/job-application.repository";
import { GetApplicationByJobRequestDTO } from "../../dto/getApplicationByJob.dto";

export class GetApplicationsByJobUseCase implements UseCase<
  GetApplicationByJobRequestDTO,
  RecruiterApplicationListItem[]
> {
  constructor(private readonly applicationRepo: JobApplicationRepository) {}

  async execute(
    request: GetApplicationByJobRequestDTO,
  ): Promise<RecruiterApplicationListItem[]> {
    if (!request.jobId?.trim()) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    return this.applicationRepo.findApplicationsWithCandidateDetails(
      request.jobId,
    );
  }
}
