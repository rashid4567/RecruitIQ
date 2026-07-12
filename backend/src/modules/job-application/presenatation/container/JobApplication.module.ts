import { openai } from "../../../../config/openai";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { MongooseUserRepository } from "../../../auth/infrastructure/repositories/mongoose-user.repository";
import { sendEmailByEventUC } from "../../../email/presentation/container/email-template.container";
import { JobRepository } from "../../../job/domain/repositories/job.repository";
import { MongooseJobRepository } from "../../../job/infrastructure/repositories/mongoose-job.repository";
import { createNotificationUC } from "../../../notification/presentation/container/notification.module";
import { ResumeRepository } from "../../../resume/domain/repository/resume.repository";
import { MongooseResumeRepository } from "../../../resume/infrastructure/repository/mongoose.resume.repository";
import { RecruiterSubscriptionRepository } from "../../../subscription/domain/repository/recruiter-subscription-plan-repository";
import { MongooseRecruiterSubscriptionRepository } from "../../../subscription/infrastructure/repositories/mongoose-recruiter-subscription.repository";
import { AnalyzeApplicationUseCase } from "../../application/usecase/candidate/AnalyzeApplicationUseCase";
import { ApplyJobUseCase } from "../../application/usecase/candidate/ApplyJobUseCase";
import { GetApplicationDetailUseCase } from "../../application/usecase/candidate/GetApplicationDetailUseCase";
import { GetMyApplicationUseCase } from "../../application/usecase/candidate/GetMyApplicationsUseCase";
import { WithdrawApplicationUseCase } from "../../application/usecase/candidate/WithdrawApplicationUseCase";
import { GetApplicationsByJobUseCase } from "../../application/usecase/recruiter/GetApplicationsByJob.useCase";
import { GetRecruiterApplicationDetailsUseCase } from "../../application/usecase/recruiter/GetRecruiterApplicationDetailsUseCase";
import { UpdateApplicationStatusUseCase } from "../../application/usecase/recruiter/UpdateApplicationStatusUseCase";
import { JobApplicationRepository } from "../../domain/repository/job-application.repository";
import { OpenAIApplicationAnalysisService } from "../../infrastructure/service/ai/OpenAIApplicationAnalysisService";
import { MongooseJobApplicationRepository } from "../../infrastructure/repository/MongooseJobApplicationRepository";
import { ApplyJobController } from "../controller/candidate/ApplyJob.controller";
import { GetApplicationDetailController } from "../controller/candidate/GetApplicationDetail.controller";
import { GetMyApplicationController } from "../controller/candidate/GetMyApplication.controller";
import { WithdrawApplicationController } from "../controller/candidate/withdrawApplication.controller";
import { GetApplicationsByJobController } from "../controller/Recruiter/GetApplicationsByJob.controller";
import { GetRecruiterApplicationDetailsController } from "../controller/Recruiter/GetRecruiterApplicationDetails.controller";
import { UpdateApplicationStatusController } from "../controller/Recruiter/updateApplication.controller";
import { MongoApplicationNumberGenerator } from "../../infrastructure/service/mongo-application-number-generator";
import { MongooseOfferRepository } from "../../../offer-letter/infrastructure/repository/mongoose.offer-letter.Repository";
import { OfferRepository } from "../../../offer-letter/domain/repository/offer-letter.repository";
import { GetRecruiterApplicationsUseCase } from "../../application/usecase/recruiter/getAllApplication.usecase";
import { GetAllApplicationRecruiterController } from "../controller/Recruiter/getAllRecruiterApplications.controller";
import { MongooseInterviewRepository } from "../../../interview/infrastructure/repository/mongooseInterview.repository";
import { InterviewRepository } from "../../../interview/domain/repository/interview.repository";

export const applicationRepo: JobApplicationRepository =
  new MongooseJobApplicationRepository();
const jobpostRepo: JobRepository = new MongooseJobRepository();
const resumeRepo: ResumeRepository = new MongooseResumeRepository();
const userRepo: UserRepository = new MongooseUserRepository();
const recruiterSubscriptionRepo: RecruiterSubscriptionRepository =
  new MongooseRecruiterSubscriptionRepository();
const analysisService = new OpenAIApplicationAnalysisService(openai);
const applicationNumberGenerator = new MongoApplicationNumberGenerator();
const offerRepo : OfferRepository = new MongooseOfferRepository()
const interviewRepo : InterviewRepository = new MongooseInterviewRepository();
export const AnalyzeApplicationUC = new AnalyzeApplicationUseCase(
  applicationRepo,
  jobpostRepo,
  resumeRepo,
  analysisService,
  recruiterSubscriptionRepo,
);

const ApplyJobUC = new ApplyJobUseCase(
  applicationRepo,
  applicationNumberGenerator,
  jobpostRepo,
  resumeRepo,
  userRepo,
  sendEmailByEventUC,
  createNotificationUC,
  AnalyzeApplicationUC,
);

const getMyApplicationUC = new GetMyApplicationUseCase(applicationRepo);
const withdrawApplicationUC = new WithdrawApplicationUseCase(applicationRepo);
const getApplicationUC = new GetApplicationDetailUseCase(
  applicationRepo,
  jobpostRepo,
  offerRepo,
);
const getApplicationByJobPostUC = new GetApplicationsByJobUseCase(
  applicationRepo,
);
const ApplicationStatusUpdateUC = new UpdateApplicationStatusUseCase(
  applicationRepo,
  userRepo,
  jobpostRepo,
  sendEmailByEventUC,
  createNotificationUC,
);
const getRecruiterApplicationDetailsUC =
  new GetRecruiterApplicationDetailsUseCase(applicationRepo,offerRepo, interviewRepo);
  export const getAllRecruiterApplicationUC = new GetRecruiterApplicationsUseCase(applicationRepo)


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
export const getRecruiterApplicationDetailsController =
  new GetRecruiterApplicationDetailsController(
    getRecruiterApplicationDetailsUC,
  );

  export const getAllRecruitercontroller = new GetAllApplicationRecruiterController(getAllRecruiterApplicationUC)
