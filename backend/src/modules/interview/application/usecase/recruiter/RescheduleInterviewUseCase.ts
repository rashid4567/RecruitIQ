import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  RescheduleInterviewRequestDTO,
  RescheduleInterviewResponseDTO,
} from "../../dto/rescheduleInterview.dto";
export class RescheduleInterviewUseCase implements IUseCase<
  RescheduleInterviewRequestDTO,
  RescheduleInterviewResponseDTO
> {
  constructor(private readonly interviewRepository: InterviewRepository) {}

  async execute(
    request: RescheduleInterviewRequestDTO,
  ): Promise<RescheduleInterviewResponseDTO> {
    const interview = await this.interviewRepository.findById(
      request.interviewId,
    );
    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToRecruiter(request.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }

    interview.reschedule(
      request.scheduledAt,
      request.durationInMinutes,
      request.meetingLink,
      request.roomId,
      request.location,
    );
    const savedInterview = await this.interviewRepository.save(interview);
    const result = savedInterview.toObject();

    return {
      id: result.id!,
      applicationId: result.applicationId,
      jobId: result.jobId,
      candidateId: result.candidateId,
      recruiterId: result.recruiterId,
      roomId: result.roomId,
      round: result.round,
      title: result.title,
      description: result.description,
      mode: result.mode,
      status: result.status,
      scheduledAt: result.scheduledAt,
      durationInMinutes: result.durationInMinutes,
      location: result.location,
      meetingLink: result.meetingLink,
      reminderSent: result.reminderSent,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
