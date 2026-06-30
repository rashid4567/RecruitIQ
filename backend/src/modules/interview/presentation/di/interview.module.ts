import { JobApplicationRepository } from "../../../job-application/domain/repository/job-application.repository";
import { MongooseJobApplicationRepository } from "../../../job-application/infrastructure/repository/MongooseJobApplicationRepository";
import { GetRecruiterInterviewDetailsUseCase } from "../../application/usecase/recruiter/GetRecruiterInterviewUseCase";
import { GetRecruiterInterviewsUseCase } from "../../application/usecase/recruiter/get.recruiter.interviews.usecase";
import { ScheduleInterviewUseCase } from "../../application/usecase/recruiter/ScheduleInterviewUseCase";
import { InterviewRepository } from "../../domain/repository/interview.repository";
import { MongooseInterviewRepository } from "../../infrastructure/repository/mongooseInterview.repository";
import { GetRecruiterInterviewsController } from "../controller/recruiter/getRecruiter.interviews.controller";
import { GetRecruiterInterviewDetailsController } from "../controller/recruiter/GetRecruiterInterviewDetails.controller";
import { ScheduleInterviewController } from "../controller/recruiter/scheduleInterview.controller";

const interviewRepo : InterviewRepository = new MongooseInterviewRepository();
const applicationRepo : JobApplicationRepository = new MongooseJobApplicationRepository();

const scheduleInterviewUC = new ScheduleInterviewUseCase(interviewRepo, applicationRepo);
const getRecruiterInterviewUC = new GetRecruiterInterviewsUseCase(interviewRepo,applicationRepo);
const getRecruiterInterviewDetailsUC = new GetRecruiterInterviewDetailsUseCase(interviewRepo)

export const scheduleInterviewController = new ScheduleInterviewController(scheduleInterviewUC)
export const getRecruiterInterviewsController = new GetRecruiterInterviewsController(getRecruiterInterviewUC)
export const getRecruiterInterviewDetailsController = new GetRecruiterInterviewDetailsController(getRecruiterInterviewDetailsUC)