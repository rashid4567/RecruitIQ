import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UserRepository } from "../../../../auth/domain/repositories/user.repository";
import { SendEmailByEventUseCase } from "../../../../email/application/usecase/email-template/send-email-by-event.usecase";
import { EmailEvent } from "../../../../email/domain/constant/templateEvents";
import { JobApplicationRepository } from "../../../../job-application/domain/repository/job-application.repository";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/infrastructure/mongoose/notification.model";
import {
  Interview,
  InterviewMode,
} from "../../../domain/entity/interview.entity";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  ScheduleInterviewRequestDTO,
  ScheduleInterviewResponseDTO,
} from "../../dto/schedule.interview.dto";
import { IdGenerator } from "../../ports/id-generator";

export class ScheduleInterviewUseCase implements IUseCase<
  ScheduleInterviewRequestDTO,
  ScheduleInterviewResponseDTO
> {
  constructor(
    private readonly interviewRepo: InterviewRepository,
    private readonly applicationRepo: JobApplicationRepository,
    private readonly userRepo: UserRepository,
    private readonly jobRepo: JobRepository,
    private readonly sendEmailByEventUC: SendEmailByEventUseCase,
    private readonly createNotificationUC: CreateNotificationUseCase,
    private readonly idGenerator: IdGenerator,
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

    const roomId =
      request.mode === InterviewMode.ONLINE
        ? this.idGenerator.generate()
        : undefined;
    const round = await this.interviewRepo.getNextRound(request.applicationId);

    const interview = Interview.create({
      applicationId: application.id,
      jobId: application.jobId,
      candidateId: application.candidateId,
      recruiterId: application.recruiterId,
      roomId,
      round,
      title: request.title,
      description: request.description,
      mode: request.mode,
      scheduledAt: request.scheduledAt,
      durationInMinutes: request.durationInMinutes,
      location: request.location,
    });

    const savedInterview = await this.interviewRepo.create(interview);

    if (!application.isSelected()) {
      application.markInterviewScheduled();
      await this.applicationRepo.save(application);
    }

    await this.notifyCandidate(savedInterview);
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
      reminderSent: result.reminderSent,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
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

      await this.sendEmailByEventUC.execute({
        to: candidate.email.getValue(),
        event: EmailEvent.INTERVIEW_SCHEDULED,
        variables: {
          candidateName: candidate.fullName,
          recruiterName: recruiter?.fullName ?? "Recruiter",
          companyName: job.companyName,
          jobTitle: job.title,
          interviewTitle: interview.title,
          interviewRound: interview.round.toString(),
          interviewMode: interview.mode,
          interviewDate: interview.scheduledAt.toLocaleString(),
          interviewDuration: `${interview.durationInMinutes} minutes`,
          interviewLocation: interview.location ?? "N/A",
          interviewDescription: interview.description ?? "",
        },
      });

      await this.createNotificationUC.execute({
        recipientId: interview.candidateId,
        recipientRole: "candidate",
        title: "Interview Scheduled",
        message: `Your Round ${interview.round} interview for "${job.title}" at ${job.companyName} has been scheduled.`,
        type: NotificationType.INTERVIEW_SCHEDULED,
        actionUrl: "/candidate/interviews",
        referenceId: interview.id,
        metadata: {
          interviewId: interview.id,
          applicationId: interview.applicationId,
          recruiterId: interview.recruiterId,
          candidateId: interview.candidateId,
          jobId: interview.jobId,
          round: interview.round,
          mode: interview.mode,
          scheduledAt: interview.scheduledAt,
          durationInMinutes: interview.durationInMinutes,
          location: interview.location,
        },
      });
    } catch (error) {
      console.error("Failed to send interview notification/email:", error);
    }
  }
}
