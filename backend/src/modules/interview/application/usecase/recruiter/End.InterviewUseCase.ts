import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobApplicationRepository } from "../../../../job-application/domain/repository/job-application.repository";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  EndInterviewRequestDTO,
  EndInterviewResponseDTO,
} from "../../dto/complete-interview.dto";

export class EndInterviewUseCase  implements IUseCase<
  EndInterviewRequestDTO,
  EndInterviewResponseDTO
> {
  constructor(
    private readonly interviewRepo: InterviewRepository,
    private readonly applicationRepo: JobApplicationRepository,
  ) {}

  async execute(
    input: EndInterviewRequestDTO,
  ): Promise<EndInterviewResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);
    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }
    if (!interview.belongsToRecruiter(input.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }
    interview.complete();
    const savedInterview = await this.interviewRepo.save(interview);
    const application = await this.applicationRepo.findById(
      interview.applicationId,
    );
    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }
    application.shortlist();
    await this.applicationRepo.save(application);
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
      startedAt: result.startedAt,
      endedAt: result.endedAt,
      durationInMinutes: result.durationInMinutes,
      meetingLink: result.meetingLink,
      location: result.location,
      notes: result.notes,
      reminderSent: result.reminderSent,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
