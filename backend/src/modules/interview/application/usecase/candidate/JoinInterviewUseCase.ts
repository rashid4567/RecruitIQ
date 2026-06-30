import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  JoinInterviewRequestDTO,
  JoinInterviewResponseDTO,
} from "../../dto/join-interview.dto";

export class JoinInterviewUseCase implements IUseCase<
  JoinInterviewRequestDTO,
  JoinInterviewResponseDTO
> {
  constructor(private readonly interviewRepo: InterviewRepository) {}

  async execute(
    input: JoinInterviewRequestDTO,
  ): Promise<JoinInterviewResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToCandidate(input.candidateId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }

    if (!interview.canJoin()) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_CANNOT_JOINED);
    }

    interview.markCandidateJoined();

    const savedInterview = await this.interviewRepo.save(interview);

    const result = savedInterview.toObject();

    return {
      id: result.id!,
      roomId: result.roomId,
      meetingLink: result.meetingLink,
      status: result.status,
      candidateJoinedAt: result.candidateJoinedAt,
      updatedAt: result.updatedAt,
    };
  }
}
