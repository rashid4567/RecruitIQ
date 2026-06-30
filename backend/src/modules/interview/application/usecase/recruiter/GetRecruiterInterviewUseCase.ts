import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  GetRecruiterInterviewDetailsRequestDTO,
  GetRecruiterInterviewDetailsResponseDTO,
} from "../../dto/getRecruiterInterview.details.dto";

export class GetRecruiterInterviewDetailsUseCase implements IUseCase<
  GetRecruiterInterviewDetailsRequestDTO,
  GetRecruiterInterviewDetailsResponseDTO
> {
  constructor(private readonly interviewRepo: InterviewRepository) {}

  async execute(
    input: GetRecruiterInterviewDetailsRequestDTO,
  ): Promise<GetRecruiterInterviewDetailsResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToRecruiter(input.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    const result = interview.toObject();

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
      startedAt: result.startedAt,
      endedAt: result.endedAt,
      recruiterJoinedAt: result.recruiterJoinedAt,
      candidateJoinedAt: result.candidateJoinedAt,
      notes: result.notes,
      cancelledReason: result.cancelledReason,
      cancelledBy: result.cancelledBy,
      reminderSent: result.reminderSent,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
