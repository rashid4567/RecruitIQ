import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  formatInterviewDate,
  formatInterviewTime,
} from "../../../../../shared/utils/date.util";
import { EmailEvent } from "../../../../admin/Domain/constatns/email-enum.events";
import { UserRepository } from "../../../../auth/domain/repositories/user.repository";
import { SendEmailByEventUseCase } from "../../../../email/application/usecase/email-template/send-email-by-event.usecase";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/infrastructure/mongoose/notification.model";
import {
  Interview,
  InterviewMode,
} from "../../../domain/entity/interview.entity";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  RescheduleInterviewRequestDTO,
  RescheduleInterviewResponseDTO,
} from "../../dto/rescheduleInterview.dto";
import { IdGenerator } from "../../ports/id-generator";
export class RescheduleInterviewUseCase implements IUseCase<
  RescheduleInterviewRequestDTO,
  RescheduleInterviewResponseDTO
> {
  constructor(
    private readonly interviewRepository: InterviewRepository,
    private readonly userRepo: UserRepository,
    private readonly jobRepo: JobRepository,
    private readonly sendEmailByEventUC: SendEmailByEventUseCase,
    private readonly createNotificationUC: CreateNotificationUseCase,
    private readonly idGenerator: IdGenerator,
  ) {}

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

    if (!interview.canBeRescheduled()) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_CANNOT_BE_RESCHEDULED);
    }

    const existingInterview =
      await this.interviewRepository.findActiveByApplicationAndRound(
        interview.applicationId,
        interview.round,
      );

    if (existingInterview && existingInterview.id !== interview.id) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ROUND_ALREADY_EXISTS);
    }

    const conflict =
      await this.interviewRepository.findRecruiterInterviewConflict(
        interview.recruiterId,
        request.scheduledAt,
        request.durationInMinutes,
        interview.id!,
      );

    if (conflict) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_INTERVIEW_TIME_CONFLICT);
    }

    const roomId =
      interview.mode === InterviewMode.ONLINE
        ? (interview.roomId ?? this.idGenerator.generate())
        : undefined;

    interview.reschedule(
      request.scheduledAt,
      request.durationInMinutes,
      roomId,
      request.location,
    );

    const savedInterview = await this.interviewRepository.save(interview);
    await this.notifyCandidate(savedInterview);
    const interviewData = savedInterview.toObject();

    return {
      id: interviewData.id!,
      applicationId: interviewData.applicationId,
      jobId: interviewData.jobId,
      candidateId: interviewData.candidateId,
      recruiterId: interviewData.recruiterId,
      roomId: interviewData.roomId,
      round: interviewData.round,
      title: interviewData.title,
      description: interviewData.description,
      mode: interviewData.mode,
      status: interviewData.status,
      scheduledAt: interviewData.scheduledAt,
      durationInMinutes: interviewData.durationInMinutes,
      location: interviewData.location,
      reminderSent: interviewData.reminderSent,
      createdAt: interviewData.createdAt,
      updatedAt: interviewData.updatedAt,
    };
  }

  private async notifyCandidate(interview: Interview): Promise<void> {
    try {
      const [candidate, recruiter, job] = await Promise.all([
        this.userRepo.findById(interview.candidateId),
        this.userRepo.findById(interview.recruiterId),
        this.jobRepo.findById(interview.jobId),
      ]);

      if (!candidate || !job) {
        return;
      }

      const interviewDate = formatInterviewDate(interview.scheduledAt);
      const interviewTime = formatInterviewTime(interview.scheduledAt);

      await this.sendEmailByEventUC.execute({
        to: candidate.email.getValue(),
        event: EmailEvent.INTERVIEW_RESCHEDULED,
        variables: {
          candidateName: candidate.fullName,
          recruiterName: recruiter?.fullName ?? "Recruiter",
          companyName: job.companyName,
          jobTitle: job.title,
          interviewTitle: interview.title,
          interviewRound: interview.round.toString(),
          interviewMode: interview.mode,
          interviewDate,
          interviewTime,
          interviewDuration: `${interview.durationInMinutes} minutes`,
          interviewLocation: interview.location ?? "N/A",
          interviewDescription: interview.description ?? "",
        },
      });

      await this.createNotificationUC.execute({
        recipientId: interview.candidateId,
        recipientRole: "candidate",
        title: "Interview Rescheduled",
        message: `Your Round ${interview.round} interview for ${job.title} has been rescheduled.`,
        type: NotificationType.INTERVIEW_RESCHEDULED,
        actionUrl: "/candidate/interviews",
        referenceId: interview.id,
        metadata: {
          interviewId: interview.id,
          applicationId: interview.applicationId,
          jobId: interview.jobId,
          scheduledAt: interview.scheduledAt,
          durationInMinutes: interview.durationInMinutes,
          mode: interview.mode,
          location: interview.location,
        },
      });
    } catch (error) {
      console.error(
        "Failed to send interview rescheduled notification/email:",
        error,
      );
    }
  }
}
