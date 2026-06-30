import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobApplicationRepository } from "../../../../job-application/domain/repository/job-application.repository";
import { Interview } from "../../../domain/entity/interview.entity";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  ScheduleInterviewRequestDTO,
  ScheduleInterviewResponseDTO,
} from "../../dto/schedule.interview.dto";

export class ScheduleInterviewUseCase implements IUseCase<
  ScheduleInterviewRequestDTO,
  ScheduleInterviewResponseDTO
> {
  constructor(
    private readonly interviewRepo: InterviewRepository,
    private readonly applicationRepo: JobApplicationRepository,
  ) {}

  async execute(
    request: ScheduleInterviewRequestDTO,
  ): Promise<ScheduleInterviewResponseDTO> {
    const application = await this.applicationRepo.findById(
      request.applicationId,
    );

    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    if (!application.canScheduleInterview()) {
      throw new ApplicationError(
        ERROR_CODES.APPLICATION_CANNOT_SCHEDULE_INTERVIEW,
      );
    }

    const existingInterview =
      await this.interviewRepo.findByApplicationAndRound(
        request.applicationId,
        request.round ?? 1,
      );

    if (existingInterview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ROUND_ALREADY_EXISTS);
    }
    const interview = Interview.create({
      applicationId: application.id,
      jobId: application.jobId,
      candidateId: application.candidateId,
      recruiterId: application.recruiterId,
      roomId: request.roomId,
      round: request.round,
      title: request.title,
      description: request.description,
      mode: request.mode,
      scheduledAt: request.scheduledAt,
      durationInMinutes: request.durationInMinutes,
      location: request.location,
      meetingLink: request.meetingLink,
    });

    const savedInterview = await this.interviewRepo.create(interview);
    application.markInterviewScheduled();
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
      durationInMinutes: result.durationInMinutes,
      location: result.location,
      meetingLink: result.meetingLink,
      reminderSent: result.reminderSent,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
