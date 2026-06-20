import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobApplication } from "../../../domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import { GetMyApplicationRequestDTO } from "../../dto/getMyApplication.dto";

export class GetMyApplicationUseCase implements UseCase<
  GetMyApplicationRequestDTO,
  JobApplication[]
> {
  constructor(private readonly applicationRepo: JobApplicationRepository) {}

  async execute(
    request: GetMyApplicationRequestDTO,
  ): Promise<JobApplication[]> {
    if (!request.candidateId) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }
    const applications = await this.applicationRepo.findByCandidate(
      request.candidateId,
    );

    if (!applications) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    return applications.sort(
      (a, b) => b.appliedAt.getTime() - a.appliedAt.getTime(),
    );
  }
}
