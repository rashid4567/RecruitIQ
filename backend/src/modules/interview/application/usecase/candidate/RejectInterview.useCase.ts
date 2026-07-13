import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants";
import { Interview } from "../../../domain/entity/interview.entity";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  RejectInterviewRequestDTO,
  RejectInterviewResponseDTO,
} from "../../dto/reject-interview.dto";

export class RejectInterviewUseCase implements IUseCase<
  RejectInterviewRequestDTO,
  RejectInterviewResponseDTO
> {
  constructor(
    private readonly interviewRepo: InterviewRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly jobRepo: JobRepository,
  ) {}

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
    await this.sendInterviewRejectedNotification(savedInterview);
    const result = savedInterview.toObject();
    return {
      id: result.id!,
      candidateResponseStatus: result.candidateResponseStatus,
      candidateRespondedAt: result.candidateRespondedAt,
      candidateResponseMessage: result.candidateResponseMessage,
      updatedAt: result.updatedAt,
    };
  }
  private async sendInterviewRejectedNotification(
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
        title: "Interview Declined",
        message: `The candidate has declined the interview invitation for "${job.title}".`,
        type: NotificationType.INTERVIEW_DECLINED,
        actionUrl: "/recruiter/interviews",
        referenceId: interview.id,
        metadata: {
          interviewId: interview.id,
          applicationId: interview.applicationId,
          recruiterId: interview.recruiterId,
          candidateId: interview.candidateId,
          jobId: interview.jobId,
          rejectedAt: interview.candidateRespondedAt,
          reason: interview.candidateResponseMessage,
        },
      });
    } catch (error) {
      console.error("Failed to create interview declined notification:", error);
    }
  }
}
