import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import {
  CandidateApplicationListItemDTO,
  GetMyApplicationRequestDTO,
} from "../../dto/getMyApplication.dto";

export class GetMyApplicationUseCase
  implements
    IUseCase<
      GetMyApplicationRequestDTO,
      CandidateApplicationListItemDTO[]
    >
{
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
  ) {}

  async execute(
    request: GetMyApplicationRequestDTO,
  ): Promise<CandidateApplicationListItemDTO[]> {
    if (!request.candidateId) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }

    const applications =
      await this.applicationRepo.findApplicationsForCandidate(
        request.candidateId,
      );

    if (!applications.length) {
      throw new ApplicationError(
        ERROR_CODES.APPLICATION_NOT_FOUND,
      );
    }

    return applications;
  }
}