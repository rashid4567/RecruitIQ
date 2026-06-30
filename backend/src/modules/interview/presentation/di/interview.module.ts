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
import { GetCandidateInterviewUseCase } from "../../application/usecase/candidate/GetCandidateInterviewsUseCase";
import { CandidateInterviewDetailsUseCase } from "../../application/usecase/candidate/GetCandidateInterviewUseCase";
import { JoinInterviewUseCase } from "../../application/usecase/candidate/JoinInterviewUseCase";
import { RecruiterInterviewCancelUseCase } from "../../application/usecase/recruiter/CancelInterviewUseCase";
import { EndInterviewUseCase } from "../../application/usecase/recruiter/End.InterviewUseCase";
import { MarkRecruiterJoinedUseCase } from "../../application/usecase/recruiter/MarkRecruiterJoinedUseCase";
import { RescheduleInterviewUseCase } from "../../application/usecase/recruiter/RescheduleInterviewUseCase";
import { StartInterviewUseCase } from "../../application/usecase/recruiter/StartInterviewUseCase";
import { CancelInterviewController } from "../controller/recruiter/cancel.interview.controller";
import { EndInterviewController } from "../controller/recruiter/end.interview.controller";
import { MarkRecruiterJoinedController } from "../controller/recruiter/mark.interview.controller";
import { RescheduleInterviewController } from "../controller/recruiter/reschedule.interview.controller";
import { StartInterviewController } from "../controller/recruiter/start.interview.controller";
import { GetCandidateInterviewDetailsController } from "../controller/candidate/getCandidate.interview.details.controller";
import { GetCandidateInterviewsController } from "../controller/candidate/getCandidate.interviews.controller";
import { JoinInterviewController } from "../controller/candidate/join.Interview.controller";

const interviewRepo: InterviewRepository = new MongooseInterviewRepository();
const applicationRepo: JobApplicationRepository =
  new MongooseJobApplicationRepository();

const getCandidateInterviewUC = new GetCandidateInterviewUseCase(interviewRepo);
const CandidateinterviewDetailUC = new CandidateInterviewDetailsUseCase(
  interviewRepo,
);
const joinInterviewUC = new JoinInterviewUseCase(interviewRepo);

const scheduleInterviewUC = new ScheduleInterviewUseCase(
  interviewRepo,
  applicationRepo,
);
const getRecruiterInterviewUC = new GetRecruiterInterviewsUseCase(
  interviewRepo,
  applicationRepo,
);
const getRecruiterInterviewDetailsUC = new GetRecruiterInterviewDetailsUseCase(
  interviewRepo,
);
const cancelInterviewUC = new RecruiterInterviewCancelUseCase(
  interviewRepo,
  applicationRepo,
);
const startinterviewUC = new StartInterviewUseCase(interviewRepo);
const endInterviewUC = new EndInterviewUseCase(interviewRepo, applicationRepo);
const markRecruiterJoinedUC = new MarkRecruiterJoinedUseCase(interviewRepo);
const rescheduleInterviewUC = new RescheduleInterviewUseCase(interviewRepo);

export const getcandidateInterviewsController =
  new GetCandidateInterviewsController(getCandidateInterviewUC);
export const getcandidateInterviewDetailsController =
  new GetCandidateInterviewDetailsController(CandidateinterviewDetailUC);
export const joinInterviewController = new JoinInterviewController(
  joinInterviewUC,
);

export const scheduleInterviewController = new ScheduleInterviewController(
  scheduleInterviewUC,
);
export const getRecruiterInterviewsController =
  new GetRecruiterInterviewsController(getRecruiterInterviewUC);
export const getRecruiterInterviewDetailsController =
  new GetRecruiterInterviewDetailsController(getRecruiterInterviewDetailsUC);
export const cancelinterviewcontroller = new CancelInterviewController(
  cancelInterviewUC,
);
export const endInterviewcontroller = new EndInterviewController(
  endInterviewUC,
);
export const markRecruiterjoinedController = new MarkRecruiterJoinedController(
  markRecruiterJoinedUC,
);
export const rescheduleInterviewController = new RescheduleInterviewController(
  rescheduleInterviewUC,
);
export const startInterviewController = new StartInterviewController(
  startinterviewUC,
);
