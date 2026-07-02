import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  AcceptInterviewRequestDTO,
  AcceptInterviewResponseDTO,
} from "../../dto/accept-interview.dto";

export class AcceptInterviewUseCase implements IUseCase<
  AcceptInterviewRequestDTO,
  AcceptInterviewResponseDTO
> {
  constructor(private readonly interviewRepo: InterviewRepository) {}

  async execute(
    input: AcceptInterviewRequestDTO,
  ): Promise<AcceptInterviewResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToCandidate(input.candidateId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }

    if (!interview.canAccept()) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ALREADY_RESPONDED);
    }

    interview.accept();
    const saveInterview = await this.interviewRepo.save(interview);
    const result = saveInterview.toObject();

    return {
      id: result.id!,
      candidateResponseStatus: result.candidateResponseStatus,
      candidateRespondedAt: result.candidateRespondedAt,
      updatedAt: result.updatedAt,
    };
  }
}
