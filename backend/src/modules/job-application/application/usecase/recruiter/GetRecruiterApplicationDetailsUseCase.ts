import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  JobApplicationRepository,
  RecruiterApplicationDetailsOutput,
} from "../../../domain/repository/job-application.repository";
import { GetRecruiterApplicationDetailsRequestDTO } from "../../dto/getRecruiterApplicationDetail.dto";

export class GetRecruiterApplicationDetailsUseCase implements UseCase<
  GetRecruiterApplicationDetailsRequestDTO,
  RecruiterApplicationDetailsOutput
> {
  constructor(
    private readonly applicationRepository: JobApplicationRepository,
  ) {}

  async execute(
    request: GetRecruiterApplicationDetailsRequestDTO,
  ): Promise<RecruiterApplicationDetailsOutput> {
    const application =
      await this.applicationRepository.findApplicationDetailsForRecruiter(
        request.applicationId,
      );

    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    if (application.recruiterId !== request.recruiterId) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    return application;
  }
}
