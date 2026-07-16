import { JobRepository } from "../../domain/repositories/job.repository";
import { MongooseJobRepository } from "../../infrastructure/repositories/mongoose-job.repository";
import { MongooseRecruiterSubscriptionRepository } from "../../../subscription/infrastructure/repositories/mongoose-recruiter-subscription.repository";
import { CreateJobUseCase } from "../../application/usecase/job/create-job.usecase";
import { DeleteJobUseCase } from "../../application/usecase/job/delete-job.usecase";
import { GetJobByIdUseCase } from "../../application/usecase/job/get-jobpost-by-id.usecase";
import { GetJobsUseCase } from "../../application/usecase/job/get-jobs.usecase";
import { PublishJobUseCase } from "../../application/usecase/job/publish-job.usecase";
import { HideJobUseCase } from "../../application/usecase/job/hide-job.usecase";
import { UnhideJobUseCase } from "../../application/usecase/job/unhide-job.post.usecase";
import { UpdateJobUseCase } from "../../application/usecase/job/update-job.usecase";
import { BlockJobUseCase } from "../../application/usecase/job/block-job-usecase";
import { UnblockJobUseCase } from "../../application/usecase/job/unblock-job-usecase";
import { CreateJobController } from "../controller/recruiter/create-job.controller";
import { DeleteJobController } from "../controller/recruiter/delete-job.controller";
import { RecruiterJobByIdController } from "../controller/recruiter/recruiter-job-by-id.controller";
import { PublishJobController } from "../controller/recruiter/publish-job.controller";
import { UpdateJobController } from "../controller/recruiter/update-job.controller";
import { ToggleJobVisibilityController } from "../controller/recruiter/toggle-job-visibility.controller";
import { RecruiterJobController } from "../controller/recruiter/recruiter-job.controller";
import { CandidateJobByIdController } from "../controller/Candidate/candidate-job-by-id.controller";
import { CandidateJobController } from "../controller/Candidate/candidate-job.controller";
import { AdminJobController } from "../controller/admin/admin-job.controller";
import { AdminJobByIdController } from "../controller/admin/admin-jobId.controller";
import { BlockJobController } from "../controller/admin/block.job.controller";
import { UnblockJobController } from "../controller/admin/unblock.job.controller";
import { ActivityTrackerService } from "../../../Activity.logger/application/services/activityTracker.service";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { MongooseUserRepository } from "../../../auth/infrastructure/repositories/mongoose-user.repository";
import { RecruiterProfileRepository } from "../../../recruiter/domain/repositories/recruiter.repository";
import { MongooseRecruiterProfileRepository } from "../../../recruiter/infrastructure/repositories/mongoose-recruiter.repository";
import { UUIDGenerator } from "../../infrastructure/service/uuid.generator.service";
import { SubscriptionPlanRepository } from "../../../subscription/domain/repository/subscription-plan.repository";
import { MongooseSubscriptionPlanRepository } from "../../../subscription/infrastructure/repositories/mongoose-subscription-plan.repository";
import { CloseJobsUseCase } from "../../application/usecase/job/close-jobs.usecase";
import { CloseJobController } from "../controller/recruiter/close.job.controller";
import { JobApplicationRepository } from "../../../job-application/domain/repository/job-application.repository";
import { MongooseJobApplicationRepository } from "../../../job-application/infrastructure/repository/MongooseJobApplicationRepository";
const jobRepo: JobRepository = new MongooseJobRepository();
const activityTracker = new ActivityTrackerService();

const userRepo: UserRepository = new MongooseUserRepository();
const recruiterSubscriptionRepo = new MongooseRecruiterSubscriptionRepository();
const recruiterRepo: RecruiterProfileRepository =
  new MongooseRecruiterProfileRepository();
const subscriptionPlanRepo: SubscriptionPlanRepository =
  new MongooseSubscriptionPlanRepository();
const applicationRepo: JobApplicationRepository =
  new MongooseJobApplicationRepository();

const createJobUC = new CreateJobUseCase(
  jobRepo,
  recruiterSubscriptionRepo,
  subscriptionPlanRepo,
  recruiterRepo,
);

const idGenerator = new UUIDGenerator();
const jobsUC = new GetJobsUseCase(jobRepo);
const getJobByIdUC = new GetJobByIdUseCase(jobRepo);
const updateJobUC = new UpdateJobUseCase(
  jobRepo,
  recruiterSubscriptionRepo,
  subscriptionPlanRepo,
);
const deleteJobUC = new DeleteJobUseCase(jobRepo);
const publishJobUC = new PublishJobUseCase(
  jobRepo,
  recruiterSubscriptionRepo,
  recruiterRepo,
  activityTracker,
  idGenerator,
  userRepo,
);
const hideJobUC = new HideJobUseCase(jobRepo);
const unhideJobUC = new UnhideJobUseCase(jobRepo);
const blockJobUC = new BlockJobUseCase(jobRepo);
const unblockJobUC = new UnblockJobUseCase(jobRepo);
const closeJobUC = new CloseJobsUseCase(jobRepo, applicationRepo);
export const createJobController = new CreateJobController(createJobUC);
export const recruiterJobsController = new RecruiterJobController(jobsUC);
export const getJobByIdController = new RecruiterJobByIdController(
  getJobByIdUC,
);
export const updateJobController = new UpdateJobController(updateJobUC);
export const deleteJobController = new DeleteJobController(deleteJobUC);
export const publishJobController = new PublishJobController(publishJobUC);
export const toggleJobVisibilityController = new ToggleJobVisibilityController(
  hideJobUC,
  unhideJobUC,
);
export const closeJobcontroller = new CloseJobController(closeJobUC);
export const candidateJobsController = new CandidateJobController(jobsUC);
export const candidateJobIdController = new CandidateJobByIdController(
  getJobByIdUC,
);
export const adminJobsController = new AdminJobController(jobsUC);
export const adminJobByIdController = new AdminJobByIdController(getJobByIdUC);
export const blockJobController = new BlockJobController(blockJobUC);
export const unblockJobController = new UnblockJobController(unblockJobUC);
