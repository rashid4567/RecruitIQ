
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";

import { JobApplicationRepository } from "../../../../job-application/domain/repository/job-application.repository";
import {
  Interview,
} from "../../../domain/entity/interview.entity";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  ScheduleInterviewRequestDTO,
  ScheduleInterviewResponseDTO,
} from "../../dto/schedule.interview.dto";

export class ScheduleInterviewUseCase
  implements
    IUseCase<
      ScheduleInterviewRequestDTO,
      ScheduleInterviewResponseDTO
    >
{
  constructor(
    private readonly interviewRepo: InterviewRepository,
    private readonly applicationRepo: JobApplicationRepository,
  ) {}

  async execute(
    input: ScheduleInterviewRequestDTO,
  ): Promise<ScheduleInterviewResponseDTO> {

    const application = await this.applicationRepo.findById(
      input.applicationId,
    );

    if (!application) {
      throw new ApplicationError(
        ERROR_CODES.APPLICATION_NOT_FOUND,
      );
    }

    const existingInterview =
      await this.interviewRepo.findByApplicationAndRound(
        input.applicationId,
        input.round ?? 1,
      );

    if (existingInterview) {
      throw new ApplicationError(
        ERROR_CODES.INTERVIEW_ROUND_ALREADY_EXISTS,
      );
    }
    const interview = Interview.create({
      applicationId: application.id,
      jobId: application.jobId,
      candidateId: application.candidateId,
      recruiterId: application.recruiterId,
      round: input.round,
      title: input.title,
      description: input.description,
      mode: input.mode,
      scheduledAt: input.scheduledAt,
      durationInMinutes: input.durationInMinutes,
      location: input.location,
      meetingLink: undefined,
      meetingRoom: undefined,
    });

    const savedInterview =
      await this.interviewRepo.create(interview);
    application.scheduleInterview(interview);

    await this.applicationRepo.save(application);
    const result = savedInterview.toObject();

    return {
      id: result.id!,
      applicationId: result.applicationId,
      jobId: result.jobId,
      candidateId: result.candidateId,
      recruiterId: result.recruiterId,
      round: result.round,
      title: result.title,
      description: result.description,
      mode: result.mode,
      status: result.status,
      scheduledAt: result.scheduledAt,
      durationInMinutes: result.durationInMinutes,
      location: result.location,
      meetingRoom: result.meetingRoom,
      meetingLink: result.meetingLink,
      reminderSent: result.reminderSent,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}