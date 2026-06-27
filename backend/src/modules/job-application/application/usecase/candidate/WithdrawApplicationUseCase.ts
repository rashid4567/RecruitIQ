import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import { WithdrawApplicationRequestDTO } from "../../dto/withdrawApplication.dto";

export class WithdrawApplicationUseCase implements IUseCase<
  WithdrawApplicationRequestDTO,
  void
> {
  constructor(private readonly applicationRepo: JobApplicationRepository) {}
  async execute(request: WithdrawApplicationRequestDTO): Promise<void> {
    const candidate = await this.applicationRepo.findByCandidate(
      request.candidateId,
    );
    if (!candidate) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }
    const application = await this.applicationRepo.findById(
      request.applicationId,
    );
    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    console.log("Application status:", application.status);
    application.withdraw();
    await this.applicationRepo.save(application);
  }
}
