import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants";
import { Interview } from "../../../domain/entity/interview.entity";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  RequestInterviewRescheduleRequestDTO,
  RequestInterviewRescheduleResponseDTO,
} from "../../dto/request-reschedule.dto";

export class RequestInterviewRescheduleUseCase implements IUseCase<
  RequestInterviewRescheduleRequestDTO,
  RequestInterviewRescheduleResponseDTO
> {
  constructor(
    private readonly interviewRepo: InterviewRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly jobRepo: JobRepository,
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
    await this.requestInterviewRescheduleRequested(savedInterview);
    const result = savedInterview.toObject();

    return {
      id: result.id!,
      rescheduleRequested: result.rescheduleRequested,
      requestedReason: result.requestedReason!,
      rescheduleRequestedAt: result.rescheduleRequestedAt!,
      updatedAt: result.updatedAt,
    };
  }
  private async requestInterviewRescheduleRequested(
    interview: Interview,
  ): Promise<void> {
    try {
      const job = await this.jobRepo.findById(interview.jobId);

      if (!job) {
        return;
      }

      await this.createNotificationUseCase.execute({
        recipientId: interview.recruiterId,
        recipientRole: "recruiter",
        title: "Interview Reschedule Requested",
        message: `The candidate has requested to reschedule the interview for "${job.title}".`,
        type: NotificationType.INTERVIEW_RESCHEDULE_REQUESTED,
        actionUrl: "/recruiter/interviews",
        referenceId: interview.id,
        metadata: {
          interviewId: interview.id,
          applicationId: interview.applicationId,
          recruiterId: interview.recruiterId,
          candidateId: interview.candidateId,
          jobId: interview.jobId,
          requestedReason: interview.requestedReason,
          requestedAt: interview.rescheduleRequestedAt,
        },
      });
    } catch (error) {
      console.error(
        "Failed to create interview reschedule request notification:",
        error,
      );
    }
  }
}
