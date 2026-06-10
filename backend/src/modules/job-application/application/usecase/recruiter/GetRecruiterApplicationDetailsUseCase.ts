import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import {
  JobApplicationRepository,
  RecruiterApplicationDetailsOutput,
} from "../../../domain/repository/job-application.repository";

export class GetRecruiterApplicationDetailsUseCase {
  constructor(
    private readonly applicationRepository: JobApplicationRepository,
  ) {}

  async execute(
    applicationId: string,
    recruiterId: string,
  ): Promise<RecruiterApplicationDetailsOutput> {
    const application =
      await this.applicationRepository.findApplicationDetailsForRecruiter(
        applicationId,
      );

    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    if (application.recruiterId !== recruiterId) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    return application;
  }
}
