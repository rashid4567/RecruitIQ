import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";

export class WithdrawApplicationUseCase {
  constructor(private readonly applicationRepo: JobApplicationRepository) {}

  async execute(applicationId: string, candidateId: string): Promise<void> {
    const application = await this.applicationRepo.findById(applicationId);

    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    console.log("Application status:", application.status);

    application.withdraw();

    await this.applicationRepo.save(application);
  }
}
