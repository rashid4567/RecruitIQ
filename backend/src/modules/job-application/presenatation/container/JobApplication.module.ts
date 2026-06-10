import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { MongooseUserRepository } from "../../../auth/infrastructure/repositories/mongoose-user.repository";
import { sendEmailByEventUC } from "../../../email/presentation/container/email-template.container";
import { JobRepository } from "../../../job/domain/repositories/job.repository";
import { MongooseJobRepository } from "../../../job/infrastructure/repositories/mongoose-job.repository";
import { ResumeRepository } from "../../../resume/domain/repository/resume.repository";
import { MongooseResumeRepository } from "../../../resume/infrastructure/repository/mongoose.resume.repository";
import { ApplyJobUseCase } from "../../application/usecase/candidate/ApplyJobUseCase";
import { GetApplicationDetailUseCase } from "../../application/usecase/candidate/GetApplicationDetailUseCase";
import { GetMyApplicationUseCase } from "../../application/usecase/candidate/GetMyApplicationsUseCase";
import { WithdrawApplicationUseCase } from "../../application/usecase/candidate/WithdrawApplicationUseCase";
import { GetApplicationsByJobUseCase } from "../../application/usecase/recruiter/GetApplicationsByJob.useCase";
import { GetRecruiterApplicationDetailsUseCase } from "../../application/usecase/recruiter/GetRecruiterApplicationDetailsUseCase";
import { UpdateApplicationStatusUseCase } from "../../application/usecase/recruiter/UpdateApplicationStatusUseCase";
import { JobApplicationRepository } from "../../domain/repository/job-application.repository";
import { MongooseJobApplicationRepository } from "../../infrastructure/repository/MongooseJobApplicationRepository";
import { ApplyJobController } from "../controller/candidate/ApplyJob.controller";
import { GetApplicationDetailController } from "../controller/candidate/GetApplicationDetail.controller";
import { GetMyApplicationController } from "../controller/candidate/GetMyApplication.controller";
import { WithdrawApplicationController } from "../controller/candidate/withdrawApplication.controller";
import { GetApplicationsByJobController } from "../controller/Recruiter/GetApplicationsByJob.controller";
import { GetRecruiterApplicationDetailsController } from "../controller/Recruiter/GetRecruiterApplicationDetails.controller";
import { UpdateApplicationStatusController } from "../controller/Recruiter/updateApplication.controller";

const applicationRepo: JobApplicationRepository =
  new MongooseJobApplicationRepository();
const jobpostRepo: JobRepository = new MongooseJobRepository();
const resumeRepo: ResumeRepository = new MongooseResumeRepository();
const userRepo: UserRepository = new MongooseUserRepository();

const ApplyJobUC = new ApplyJobUseCase(
  applicationRepo,
  jobpostRepo,
  resumeRepo,
  userRepo,
  sendEmailByEventUC,
);
const getMyApplicationUC = new GetMyApplicationUseCase(applicationRepo);
const withdrawApplicationUC = new WithdrawApplicationUseCase(applicationRepo);
const getApplicationUC = new GetApplicationDetailUseCase(
  applicationRepo,
  jobpostRepo,
);
const getApplicationByJobPostUC = new GetApplicationsByJobUseCase(
  applicationRepo,
);
const ApplicationStatusUpdateUC = new UpdateApplicationStatusUseCase(
  applicationRepo,
  userRepo,
  jobpostRepo,
  sendEmailByEventUC,
);
const getRecruiterApplicationDetailsUC  = new GetRecruiterApplicationDetailsUseCase(applicationRepo)

export const applyController = new ApplyJobController(ApplyJobUC);
export const MyApplicationController = new GetMyApplicationController(
  getMyApplicationUC,
);
export const withdrawApplicationController = new WithdrawApplicationController(
  withdrawApplicationUC,
);
export const getApplicationDetailController =
  new GetApplicationDetailController(getApplicationUC);
export const getApplicationByjobpostController =
  new GetApplicationsByJobController(getApplicationByJobPostUC);
export const updateApplicationStatuscontroller =
  new UpdateApplicationStatusController(ApplicationStatusUpdateUC);
export const getRecruiterApplicationDetailsController  = new GetRecruiterApplicationDetailsController(getRecruiterApplicationDetailsUC)