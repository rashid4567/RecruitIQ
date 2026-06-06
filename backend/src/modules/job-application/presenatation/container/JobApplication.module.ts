import { JobRepository } from "../../../job/domain/repositories/job.repository";
import { MongooseJobRepository } from "../../../job/infrastructure/repositories/mongoose-job.repository";
import { ResumeRepository } from "../../../resume/domain/repository/resume.repository";
import { MongooseResumeRepository } from "../../../resume/infrastructure/repository/mongoose.resume.repository";
import { ApplyJobUseCase } from "../../application/usecase/candidate/ApplyJobUseCase";
import { GetApplicationDetailUseCase } from "../../application/usecase/candidate/GetApplicationDetailUseCase";
import { GetMyApplicationUseCase } from "../../application/usecase/candidate/GetMyApplicationsUseCase";
import { WithdrawApplicationUseCase } from "../../application/usecase/candidate/WithdrawApplicationUseCase";
import { GetApplicationsByJobUseCase } from "../../application/usecase/recruiter/GetApplicationsByJob.useCase";
import { JobApplicationRepository } from "../../domain/repository/job-application.repository";
import { MongooseJobApplicationRepository } from "../../infrastructure/repository/MongooseJobApplicationRepository";
import { ApplyJobController } from "../controller/candidate/ApplyJob.controller";
import { GetApplicationDetailController } from "../controller/candidate/GetApplicationDetail.controller";
import { GetMyApplicationController } from "../controller/candidate/GetMyApplication.controller";
import { WithdrawApplicationController } from "../controller/candidate/withdrawApplication.controller";
import { GetApplicationsByJobController } from "../controller/Recruiter/GetApplicationsByJob.controller";




const applicationRepo : JobApplicationRepository = new MongooseJobApplicationRepository()
const jobpostRepo : JobRepository = new MongooseJobRepository();
const resumeRepo : ResumeRepository = new MongooseResumeRepository()

const ApplyJobUC = new ApplyJobUseCase(applicationRepo,jobpostRepo,resumeRepo);
const getMyApplicationUC = new GetMyApplicationUseCase(applicationRepo)
const withdrawApplicationUC = new WithdrawApplicationUseCase(applicationRepo)
const getApplicationUC = new GetApplicationDetailUseCase(applicationRepo, jobpostRepo)
const getApplicationByJobPostUC = new GetApplicationsByJobUseCase(applicationRepo); 

export const applyController = new ApplyJobController(ApplyJobUC);
export const MyApplicationController = new GetMyApplicationController(getMyApplicationUC)
export const withdrawApplicationController = new WithdrawApplicationController(withdrawApplicationUC);
export const getApplicationDetailController  = new GetApplicationDetailController(getApplicationUC);
export const getApplicationByjobpostController = new GetApplicationsByJobController(getApplicationByJobPostUC);
