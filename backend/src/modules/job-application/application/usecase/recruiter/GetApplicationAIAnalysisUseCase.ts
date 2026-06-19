import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import {
  GetApplicationAIAnalysisOutput,
  GetApplicationAIAnalysisRequestDTO,
} from "../../dto/GetApplicationAIAnalysisOutput.dto";

export class GetApplicationAIAnalysisUseCase implements UseCase<
  GetApplicationAIAnalysisRequestDTO,
  GetApplicationAIAnalysisOutput
> {
  constructor(
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  async execute(
    request: GetApplicationAIAnalysisRequestDTO,
  ): Promise<GetApplicationAIAnalysisOutput> {
    const application =
      await this.jobApplicationRepository.findApplicationDetailsForRecruiter(
        request.applicationId,
      );
    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    return {
      applicationId: application.applicationId,
      aiAnalysis: application.aiAnalysis ?? null,
    };
  }
}
