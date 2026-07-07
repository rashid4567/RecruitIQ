import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { RecruiterProfileRepository } from "../../../recruiter/domain/repositories/recruiter.repository";
import { JobRepository } from "../../../job/domain/repositories/job.repository";
import { JobApplicationRepository } from "../../../job-application/domain/repository/job-application.repository";
import { InterviewRepository } from "../../../interview/domain/repository/interview.repository";
import { RecruiterSubscriptionRepository } from "../../../subscription/domain/repository/recruiter-subscription-plan-repository";
import { NotificationRepository } from "../../../notification/domain/repositories/notification.repository";
import { RecruiterRepository } from "../../../admin/Domain/repositories/recruiter.repository";
import { CandidateRepository } from "../../../admin/Domain/repositories/candidate.repository";
import { ActivityLogRepository } from "../../../Activity.logger/domain/repositories/activity-log.repository";
import { MongooseUserRepository } from "../../../auth/infrastructure/repositories/mongoose-user.repository";
import { MongooseRecruiterProfileRepository } from "../../../recruiter/infrastructure/repositories/mongoose-recruiter.repository";
import { MongooseJobRepository } from "../../../job/infrastructure/repositories/mongoose-job.repository";
import { MongooseJobApplicationRepository } from "../../../job-application/infrastructure/repository/MongooseJobApplicationRepository";
import { MongooseInterviewRepository } from "../../../interview/infrastructure/repository/mongooseInterview.repository";
import { MongooseRecruiterSubscriptionRepository } from "../../../subscription/infrastructure/repositories/mongoose-recruiter-subscription.repository";
import { MongooseNotificationRepository } from "../../../notification/infrastructure/repositories/mongoose.notification.repository";
import { MongooseRecruiterRepository } from "../../../admin/Infrastructure/repositories/mongoose-recruiter.repository";
import { MongooseCandidateRepository } from "../../../admin/Infrastructure/repositories/mongoose-candidate.repository";
import { ActivityLogFileRepository } from "../../../Activity.logger/infrastructure/repositories/activity-log-file.repository";
import { GetRecruiterDashboardUseCase } from "../../application/usecases/get-recruiter-dashboard.usecase";
import { GetAdminDashboardUseCase } from "../../application/usecases/get-admin-dashboard.usecase";
import { RecruiterDashboardController } from "../controller/recruiter-dashboard.controller";
import { AdminDashboardController } from "../controller/admin-dashboard.controller";

const userRepo: UserRepository = new MongooseUserRepository();
const recruiterProfileRepo: RecruiterProfileRepository =
  new MongooseRecruiterProfileRepository();
const recruiterRepo: RecruiterRepository = new MongooseRecruiterRepository();
const candidateRepo: CandidateRepository = new MongooseCandidateRepository();
const jobRepo: JobRepository = new MongooseJobRepository();
const applicationRepo: JobApplicationRepository =
  new MongooseJobApplicationRepository();
const interviewRepo: InterviewRepository = new MongooseInterviewRepository();
const subscriptionRepo: RecruiterSubscriptionRepository =
  new MongooseRecruiterSubscriptionRepository();
const notificationRepo: NotificationRepository =
  new MongooseNotificationRepository();
const activityLogRepo: ActivityLogRepository = new ActivityLogFileRepository();
const recruiterDashboardUseCase = new GetRecruiterDashboardUseCase(
  userRepo,
  recruiterProfileRepo,
  jobRepo,
  applicationRepo,
  interviewRepo,
  subscriptionRepo,
  notificationRepo,
);
export const recruiterDashbordController = new RecruiterDashboardController(
  recruiterDashboardUseCase,
);

const adminDashboardUseCase = new GetAdminDashboardUseCase(
  recruiterRepo,
  candidateRepo,
  jobRepo,
  applicationRepo,
  subscriptionRepo,
  activityLogRepo,
);

export const adminDashboardController = new AdminDashboardController(
  adminDashboardUseCase,
);
