import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants";
import {
  RecruiterDashboardDTO,
  RecruiterDashboardRequestDTO,
} from "../dto/recruiter-dashboard.dto";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { RecruiterProfileRepository } from "../../../recruiter/domain/repositories/recruiter.repository";
import { JobRepository } from "../../../job/domain/repositories/job.repository";
import { JobApplicationRepository } from "../../../job-application/domain/repository/job-application.repository";
import { InterviewRepository } from "../../../interview/domain/repository/interview.repository";
import { RecruiterSubscriptionRepository } from "../../../subscription/domain/repository/recruiter-subscription-plan-repository";
import { NotificationRepository } from "../../../notification/domain/repositories/notification.repository";
import { UserId } from "../../../../shared/value-objects/userId.vo";

export class GetRecruiterDashboardUseCase implements IUseCase<
  RecruiterDashboardRequestDTO,
  RecruiterDashboardDTO
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly recruiterProfileRepository: RecruiterProfileRepository,
    private readonly jobRepository: JobRepository,
    private readonly applicationRepository: JobApplicationRepository,
    private readonly interviewRepository: InterviewRepository,
    private readonly subscriptionRepository: RecruiterSubscriptionRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(
    request: RecruiterDashboardRequestDTO,
  ): Promise<RecruiterDashboardDTO> {
    const { recruiterId } = request;
    const recruiter = await this.userRepository.findById(recruiterId);
    if (!recruiter) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }
    const recruiterProfile = await this.recruiterProfileRepository.findByUserId(
      UserId.create(recruiterId),
    );

    const [jobs, applications, interviews, subscription, notifications] =
      await Promise.all([
        this.jobRepository.findByRecruiter(recruiterId),
        this.applicationRepository.findByRecruiter(recruiterId),
        this.interviewRepository.findByRecruiter(recruiterId),
        this.subscriptionRepository.findActiveByRecruiter(recruiterId),
        this.notificationRepository.findByRecipientId(recruiterId),
      ]);

    const candidateIds = [
      ...new Set([
        ...applications.map((a) => a.candidateId),
        ...interviews.map((i) => i.candidateId),
      ]),
    ];

    const candidates = await this.userRepository.findByIds(candidateIds);
    const candidateMap = new Map(
      candidates.map((candidate) => [candidate.id!, candidate]),
    );

    const jobMap = new Map(jobs.map((job) => [job.id!, job]));
    return {
      recruiter: {
        recruiterId: recruiter.id!,
        recruiterName: recruiter.fullName,
        companyName: recruiterProfile?.getCompanyName(),
        profileImage: recruiter.profileImage,
      },

      jobs: jobs.map((job) => ({
        id: job.id,
        title: job.title,
        status: job.status,
        views: job.views,
        applicationsCount: job.applicationsCount,
        publicationCount: job.publicationCount,
        createdAt: job.createdAt,
      })),

      applications: applications.map((application) => {
        const candidate = candidateMap.get(application.candidateId);
        const job = jobMap.get(application.jobId);

        return {
          applicationId: application.id,
          applicationNumber: application.applicationNumber,
          candidateId: application.candidateId,
          candidateName: candidate?.fullName ?? "",
          candidateEmail: candidate?.email.getValue() ?? "",
          candidateProfileImage: candidate?.profileImage,
          jobId: application.jobId,
          jobTitle: job?.title ?? "",
          resumeId: application.resumeId,
          resumeFileName: "",
          status: application.status,
          analysisStatus: application.analysisStatus,
          aiScore: application.aiAnalysis?.overallScore,
          recommendation: application.aiAnalysis?.recommendation,
          appliedAt: application.appliedAt,
        };
      }),

      interviews: interviews.map((interview) => {
        const candidate = candidateMap.get(interview.candidateId);
        const job = jobMap.get(interview.jobId);
        return {
          interviewId: interview.id,
          applicationId: interview.applicationId,
          candidateId: interview.candidateId,
          candidateName: candidate?.fullName ?? "",
          candidateProfileImage: candidate?.profileImage,
          jobId: interview.jobId,
          jobTitle: job?.title ?? "",
          round: interview.round,
          status: interview.status,
          scheduledAt: interview.scheduledAt,
          roomId: interview.roomId,
        };
      }),

      subscription: subscription
        ? {
            planName: subscription.planName,
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            jobPostsUsed: subscription.jobPostsUsed,
            jobPostsLimit: subscription.jobPostsLimit,
            screeningUsed: subscription.screeningUsed,
            screeningLimit: subscription.screeningLimit,
            aiScoreUsed: subscription.aiScoreUsed,
            aiScoreLimit: subscription.aiScoreLimit,
            resumeDownloadedCount: subscription.resumeDownloadedCount,
          }
        : null,

      notifications: notifications.map((notification) => ({
        id: notification.getId()!,
        title: notification.getTitle(),
        message: notification.getMessage(),
        type: notification.getType(),
        isRead: notification.isRead(),
        createdAt: notification.getProps().createdAt!,
      })),
    };
  }
}
