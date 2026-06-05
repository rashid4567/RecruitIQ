import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { JobApplication } from "../../domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../domain/repository/job-application.repository";

export class GetMyApplicationUseCase {
  constructor(private readonly applicationRepo: JobApplicationRepository) {}

  async execute(candidateId: string): Promise<JobApplication[]> {
    if (!candidateId) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }
    const applications =
      await this.applicationRepo.findByCandidate(candidateId);

    if (!applications) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    return applications.sort(
      (a, b) => b.appliedAt.getTime() - a.appliedAt.getTime(),
    );
  }
}
