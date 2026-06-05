import { JobRepository } from "../../../job/domain/repositories/job.repository";
import { MongooseJobRepository } from "../../../job/infrastructure/repositories/mongoose-job.repository";
import { ResumeRepository } from "../../../resume/domain/repository/resume.repository";
import { MongooseResumeRepository } from "../../../resume/infrastructure/repository/mongoose.resume.repository";
import { ApplyJobUseCase } from "../../application/usecase/ApplyJobUseCase";
import { GetMyApplicationUseCase } from "../../application/usecase/GetMyApplicationsUseCase";
import { WithdrawApplicationUseCase } from "../../application/usecase/WithdrawApplicationUseCase";
import { JobApplicationRepository } from "../../domain/repository/job-application.repository";
import { MongooseJobApplicationRepository } from "../../infrastructure/repository/MongooseJobApplicationRepository";
import { ApplyJobController } from "../controller/ApplyJob.controller";
import { GetMyApplicationController } from "../controller/GetMyApplication.controller";
import { WithdrawApplicationController } from "../controller/withdrawApplication.controller";




const applicationRepo : JobApplicationRepository = new MongooseJobApplicationRepository()
const jobpostRepo : JobRepository = new MongooseJobRepository();
const resumeRepo : ResumeRepository = new MongooseResumeRepository()

const ApplyJobUC = new ApplyJobUseCase(applicationRepo,jobpostRepo,resumeRepo);
const getMyApplicationUC = new GetMyApplicationUseCase(applicationRepo)
const withdrawApplicationUC = new WithdrawApplicationUseCase(applicationRepo)

export const applyController = new ApplyJobController(ApplyJobUC);
export const MyApplicationController = new GetMyApplicationController(getMyApplicationUC)
export const withdrawApplicationController = new WithdrawApplicationController(withdrawApplicationUC);