import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants";
import { Interview } from "../../../domain/entity/interview.entity";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  AcceptInterviewRequestDTO,
  AcceptInterviewResponseDTO,
} from "../../dto/accept-interview.dto";

export class AcceptInterviewUseCase implements IUseCase<
  AcceptInterviewRequestDTO,
  AcceptInterviewResponseDTO
> {
  constructor(
    private readonly interviewRepo: InterviewRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly jobRepo: JobRepository,
  ) {}

  async execute(
    input: AcceptInterviewRequestDTO,
  ): Promise<AcceptInterviewResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToCandidate(input.candidateId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }

    if (!interview.canAccept()) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ALREADY_RESPONDED);
    }

    interview.accept();
    const saveInterview = await this.interviewRepo.save(interview);
    await this.sendInterviewAcceptedNotification(saveInterview);
    const result = saveInterview.toObject();

    return {
      id: result.id!,
      candidateResponseStatus: result.candidateResponseStatus,
      candidateRespondedAt: result.candidateRespondedAt,
      updatedAt: result.updatedAt,
    };
  }
  private async sendInterviewAcceptedNotification(
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
        title: "Interview Accepted",
        message: `The candidate has accepted the interview invitation for "${job.title}".`,
        type: NotificationType.INTERVIEW_ACCEPTED,
        actionUrl: "/recruiter/interviews",
        referenceId: interview.id,
        metadata: {
          interviewId: interview.id,
          applicationId: interview.applicationId,
          recruiterId: interview.recruiterId,
          candidateId: interview.candidateId,
          jobId: interview.jobId,
          acceptedAt: interview.candidateRespondedAt,
        },
      });
    } catch (error) {
      console.error("Failed to create interview accepted notification:", error);
    }
  }
}
