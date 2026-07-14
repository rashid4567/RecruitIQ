import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UserRepository } from "../../../../auth/domain/repositories/user.repository";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/infrastructure/mongoose/notification.model";
import { RecruiterSubscriptionRepository } from "../../../../subscription/domain/repository/recruiter-subscription-plan-repository";
import { CandidateResponseStatus, Interview } from "../../../domain/entity/interview.entity";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  StartInterviewRequestDTO,
  StartInterviewResponseDTO,
} from "../../dto/start-interview.dto";

export class StartInterviewUseCase implements IUseCase<
  StartInterviewRequestDTO,
  StartInterviewResponseDTO
> {
  constructor(
    private readonly interviewRepo: InterviewRepository,
    private readonly recruiterSubscriptionRepo: RecruiterSubscriptionRepository,
    private readonly createNotificationUC: CreateNotificationUseCase,
    private readonly userRepo: UserRepository,
    private readonly jobRepo: JobRepository,
  ) {}

  async execute(
    input: StartInterviewRequestDTO,
  ): Promise<StartInterviewResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToRecruiter(input.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }

    if (!interview.canStart()) {
      throw new ApplicationError(ERROR_CODES.INVALID_INTERVIEW_STATUS_TO_START);
    }

    if (!interview.hasRoom()) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ROOM_NOT_FOUND);
    }

    if (
  interview.candidateResponseStatus !==
  CandidateResponseStatus.ACCEPTED
) {
  throw new ApplicationError(
    ERROR_CODES.CANDIDATE_HAS_NOT_ACCEPTED_INTERVIEW,
  );
}

    const subscription =
      await this.recruiterSubscriptionRepo.findActiveByRecruiter(
        input.recruiterId,
      );

    if (!subscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_REQUIRED);
    }

    if (!subscription.hasScreeningAccess()) {
      throw new ApplicationError(ERROR_CODES.SCREENING_LIMIT_EXCEEDED);
    }

    const updatedSubscription = subscription.consumeScreening();
    await this.recruiterSubscriptionRepo.update(updatedSubscription);
    interview.start();
    interview.markRecruiterJoined();
    const savedInterview = await this.interviewRepo.save(interview);
    await this.notifyCandidate(savedInterview);
    const result = savedInterview.toObject();

    return {
      id: result.id!,
      status: result.status,
      startedAt: result.startedAt,
      updatedAt: result.updatedAt,
    };
  }

  private async notifyCandidate(interview: Interview): Promise<void> {
    try {
      const job = await this.jobRepo.findById(interview.jobId);

      if (!job) {
        return;
      }

      await this.createNotificationUC.execute({
        recipientId: interview.candidateId,
        recipientRole: "candidate",
        title: "Interview Started",
        message: `Your recruiter has started the interview for "${job.title}". You can join now.`,
        type: NotificationType.INTERVIEW_STARTED,
        actionUrl: "/candidate/interviews",
        referenceId: interview.id,
        metadata: {
          interviewId: interview.id,
          applicationId: interview.applicationId,
          recruiterId: interview.recruiterId,
          candidateId: interview.candidateId,
          jobId: interview.jobId,
          startedAt: interview.startedAt,
        },
      });
    } catch (error) {
      console.error("Failed to create interview started notification:", error);
    }
  }
}
