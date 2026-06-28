import { JobApplicationRepository } from "../../../job-application/domain/repository/job-application.repository";
import { MongooseJobApplicationRepository } from "../../../job-application/infrastructure/repository/MongooseJobApplicationRepository";
import { ScheduleInterviewUseCase } from "../../application/usecase/recruiter/ScheduleInterviewUseCase";
import { InterviewRepository } from "../../domain/repository/interview.repository";
import { MongooseInterviewRepository } from "../../infrastructure/repository/mongooseInterview.repository";
import { ScheduleInterviewController } from "../controller/recruiter/scheduleInterview.controller";

const interviewRepo : InterviewRepository = new MongooseInterviewRepository();
const applicationRepo : JobApplicationRepository = new MongooseJobApplicationRepository();

const scheduleInterviewUC = new ScheduleInterviewUseCase(interviewRepo, applicationRepo);


export const scheduleInterviewController = new ScheduleInterviewController(scheduleInterviewUC)
