import { JobRepository } from "../../../job/domain/repositories/job.repository";
import { MongooseJobRepository } from "../../../job/infrastructure/repositories/mongoose-job.repository";
import { ResumeRepository } from "../../../resume/domain/repository/resume.repository";
import { MongooseResumeRepository } from "../../../resume/infrastructure/repository/mongoose.resume.repository";
import { ApplyJobUseCase } from "../../application/usecase/ApplyJobUseCase";
import { JobApplicationRepository } from "../../domain/repository/job-application.repository";
import { MongooseJobApplicationRepository } from "../../infrastructure/repository/MongooseJobApplicationRepository";
import { ApplyJobController } from "../controller/ApplyJobController";




const applicationRepo : JobApplicationRepository = new MongooseJobApplicationRepository()
const jobpostRepo : JobRepository = new MongooseJobRepository();
const resumeRepo : ResumeRepository = new MongooseResumeRepository()

const ApplyJobUC = new ApplyJobUseCase(applicationRepo,jobpostRepo,resumeRepo);


export const applyController = new ApplyJobController(ApplyJobUC);