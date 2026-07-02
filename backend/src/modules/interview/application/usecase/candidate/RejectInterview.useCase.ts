import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  RejectInterviewRequestDTO,
  RejectInterviewResponseDTO,
} from "../../dto/reject-interview.dto";

export class RejectInterviewUseCase implements IUseCase<
  RejectInterviewRequestDTO,
  RejectInterviewResponseDTO
> {
  constructor(private readonly interviewRepo: InterviewRepository) {}

  async execute(
    input: RejectInterviewRequestDTO,
  ): Promise<RejectInterviewResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToCandidate(input.candidateId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.canReject()) {
      throw new ApplicationError(ERROR_CODES.UNABLE_TO_REJECT_INTERVIEW);
    }

    interview.reject();
    const savedInterview = await this.interviewRepo.save(interview);
    const result = savedInterview.toObject();
    return {
      id: result.id!,
      candidateResponseStatus: result.candidateResponseStatus,
      candidateRespondedAt: result.candidateRespondedAt,
      candidateResponseMessage: result.candidateResponseMessage,
      updatedAt: result.updatedAt,
    };
  }
}
