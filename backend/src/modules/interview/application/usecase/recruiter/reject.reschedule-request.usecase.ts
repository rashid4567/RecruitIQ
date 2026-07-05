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
import { Interview } from "../../../domain/entity/interview.entity";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  RejectRescheduleRequestDTO,
  RejectRescheduleResponseDTO,
} from "../../dto/reject-reschedule-request.dto";

export class RejectRescheduleRequestUseCase implements IUseCase<
  RejectRescheduleRequestDTO,
  RejectRescheduleResponseDTO
> {
  constructor(
    private readonly interviewRepo: InterviewRepository,
    private readonly userRepo: UserRepository,
    private readonly jobRepo: JobRepository,
    private readonly sendEmailByEventUC: SendEmailByEventUseCase,
    private readonly createNotificationUC: CreateNotificationUseCase,
  ) {}
  async execute(
    input: RejectRescheduleRequestDTO,
  ): Promise<RejectRescheduleResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToRecruiter(input.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }

    interview.rejectRescheduleRequest();
    const savedInterview = await this.interviewRepo.save(interview);
    await this.notifyCandidate(savedInterview);
    const response = savedInterview.toObject();

    return {
      id: response.id!,
      rescheduleRequested: response.rescheduleRequested,
      updatedAt: response.updatedAt,
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
        event: EmailEvent.INTERVIEW_RESCHEDULE_REQUEST_REJECTED,
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
        },
      });

      await this.createNotificationUC.execute({
        recipientId: interview.candidateId,
        recipientRole: "candidate",
        title: "Reschedule Request Rejected",
        message: `Your request to reschedule the Round ${interview.round} interview for ${job.title} has been rejected. Please attend the interview at the originally scheduled time.`,
        type: NotificationType.INTERVIEW_RESCHEDULE_REQUEST_REJECTED,
        actionUrl: "/candidate/interviews",
        referenceId: interview.id,
        metadata: {
          interviewId: interview.id,
          applicationId: interview.applicationId,
          jobId: interview.jobId,
          scheduledAt: interview.scheduledAt,
          location: interview.location,
        },
      });
    } catch (error) {
      console.error(
        "Failed to send reschedule rejection notification/email:",
        error,
      );
    }
  }
}
