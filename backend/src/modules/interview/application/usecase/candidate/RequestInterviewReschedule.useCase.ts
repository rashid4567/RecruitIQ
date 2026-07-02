import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  RequestInterviewRescheduleRequestDTO,
  RequestInterviewRescheduleResponseDTO,
} from "../../dto/request-reschedule.dto";

export class RequestInterviewRescheduleUseCase
  implements
    IUseCase<
      RequestInterviewRescheduleRequestDTO,
      RequestInterviewRescheduleResponseDTO
    >
{
  constructor(
    private readonly interviewRepo: InterviewRepository,
  ) {}

  async execute(
    input: RequestInterviewRescheduleRequestDTO,
  ): Promise<RequestInterviewRescheduleResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToCandidate(input.candidateId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }

    if (!interview.canRequestReschedule()) {
      throw new ApplicationError(
        ERROR_CODES.INTERVIEW_CANNOT_REQUEST_RESCHEDULE,
      );
    }

    interview.requestReschedule(input.reason);

    const savedInterview = await this.interviewRepo.save(interview);

    const result = savedInterview.toObject();

    return {
      id: result.id!,
      rescheduleRequested: result.rescheduleRequested,
      requestedReason: result.requestedReason!,
      rescheduleRequestedAt: result.rescheduleRequestedAt!,
      updatedAt: result.updatedAt,
    };
  }
}