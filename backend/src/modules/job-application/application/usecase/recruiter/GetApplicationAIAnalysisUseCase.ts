import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import { GetApplicationAIAnalysisOutput } from "../../dto/GetApplicationAIAnalysisOutput.dto";

export class GetApplicationAIAnalysisUseCase {
  constructor(
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  async execute(
    applicationId: string,
  ): Promise<GetApplicationAIAnalysisOutput> {
    const application =
      await this.jobApplicationRepository.findApplicationDetailsForRecruiter(
        applicationId,
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
