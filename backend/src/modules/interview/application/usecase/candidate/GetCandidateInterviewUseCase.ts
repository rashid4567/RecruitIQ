import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  CandidateInterviewDetailsRequestDTO,
  CandidateInterviewDetailsResponseDTO,
} from "../../dto/getCandidateInterviews.dto";

export class CandidateInterviewDetailsUseCase implements IUseCase<
  CandidateInterviewDetailsRequestDTO,
  CandidateInterviewDetailsResponseDTO
> {
  constructor(private readonly interviewRepository: InterviewRepository) {}

  async execute(
    request: CandidateInterviewDetailsRequestDTO,
  ): Promise<CandidateInterviewDetailsResponseDTO> {
    const interview = await this.interviewRepository.findById(
      request.interviewId,
    );

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToCandidate(request.candidateId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }

    const data = interview.toObject();

    return {
      id: interview.id,
      applicationId: data.applicationId,
      jobId: data.jobId,
      recruiterId: data.recruiterId,
      roomId: data.roomId,
      title: data.title,
      description: data.description,
      round: data.round,
      mode: data.mode,
      status: data.status,
      candidateResponseStatus : data.candidateResponseStatus,
      candidateRespondedAt : data.candidateRespondedAt,
      candidateResponseMessage : data.candidateResponseMessage,
      rescheduleRequested : data.rescheduleRequested,
      requestedReason : data.requestedReason,
      rescheduleRequestedAt : data.rescheduleRequestedAt,
      scheduledAt: data.scheduledAt,
      durationInMinutes: data.durationInMinutes,
      meetingLink: data.meetingLink,
      location: data.location,
      recruiterJoinedAt: data.recruiterJoinedAt,
      candidateJoinedAt: data.candidateJoinedAt,
      startedAt: data.startedAt,
      endedAt: data.endedAt,
      notes: data.notes,
      reminderSent: data.reminderSent,
      canJoin: interview.canJoin(),
      canCancel: interview.canCancel(),
      canReschedule: interview.canReschedule(),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
