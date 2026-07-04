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
import { AcceptInterviewUseCase } from "../../application/usecase/candidate/AcceptInterview.useCase";
import { RejectInterviewUseCase } from "../../application/usecase/candidate/RejectInterview.useCase";
import { RequestInterviewRescheduleUseCase } from "../../application/usecase/candidate/RequestInterviewReschedule.useCase";
import { AcceptInterviewController } from "../controller/candidate/accept.interview.controller";
import { RejectInterviewController } from "../controller/candidate/reject.interview.controller";
import { RequestInterviewRescheduleController } from "../controller/candidate/request-reschedule.interview.controller";
import { ApproveRescheduleRequestUseCase } from "../../application/usecase/recruiter/approve.reschedule-request.usecase";
import { RejectRescheduleRequestUseCase } from "../../application/usecase/recruiter/reject.reschedule-request.usecase";
import { AcceptReschduleInterviewRequestController } from "../controller/recruiter/Approve.reschedule.request.controller";
import { RejectRescheduleReqestController } from "../controller/recruiter/reject.Reschedule.request.controller";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { MongooseUserRepository } from "../../../auth/infrastructure/repositories/mongoose-user.repository";
import { JobRepository } from "../../../job/domain/repositories/job.repository";
import { MongooseJobRepository } from "../../../job/infrastructure/repositories/mongoose-job.repository";
import { sendEmailByEventUC } from "../../../email/presentation/container/email-template.container";
import { createNotificationUC } from "../../../notification/presentation/container/notification.module";
import { ValidateInterviewRoomAccessUseCase } from "../../application/usecase/common/ValidateInterviewRoomAccessUseCase";

const interviewRepo: InterviewRepository = new MongooseInterviewRepository();
const applicationRepo: JobApplicationRepository =
  new MongooseJobApplicationRepository();
const userRepo: UserRepository = new MongooseUserRepository();
const jobRepo: JobRepository = new MongooseJobRepository();

const getCandidateInterviewUC = new GetCandidateInterviewUseCase(interviewRepo);
const CandidateinterviewDetailUC = new CandidateInterviewDetailsUseCase(
  interviewRepo,
);
const acceptInterviewUC = new AcceptInterviewUseCase(interviewRepo);
const rejectInterviewUC = new RejectInterviewUseCase(interviewRepo);
const requestRescheduleInterviewUC = new RequestInterviewRescheduleUseCase(
  interviewRepo,
);
const joinInterviewUC = new JoinInterviewUseCase(interviewRepo);
export const validateInterviewUC = new ValidateInterviewRoomAccessUseCase(interviewRepo);
const scheduleInterviewUC = new ScheduleInterviewUseCase(
  interviewRepo,
  applicationRepo,
  userRepo,
  jobRepo,
  sendEmailByEventUC,
  createNotificationUC,
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
const ApproveRescheduleRequestUC = new ApproveRescheduleRequestUseCase(
  interviewRepo,
);
const rejectRescheduleRequestUC = new RejectRescheduleRequestUseCase(
  interviewRepo,
  userRepo,
  jobRepo,
  sendEmailByEventUC,
  createNotificationUC,
);
const startinterviewUC = new StartInterviewUseCase(interviewRepo);
const endInterviewUC = new EndInterviewUseCase(interviewRepo, applicationRepo);
const markRecruiterJoinedUC = new MarkRecruiterJoinedUseCase(interviewRepo);
const rescheduleInterviewUC = new RescheduleInterviewUseCase(
  interviewRepo,
  userRepo,
  jobRepo,
  sendEmailByEventUC,
  createNotificationUC,
);

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
export const acceptReschduleInterviewController =
  new AcceptReschduleInterviewRequestController(ApproveRescheduleRequestUC);
export const rejectRescheduleInterviewController =
  new RejectRescheduleReqestController(rejectRescheduleRequestUC);

export const getRecruiterInterviewsController =
  new GetRecruiterInterviewsController(getRecruiterInterviewUC);
export const getRecruiterInterviewDetailsController =
  new GetRecruiterInterviewDetailsController(getRecruiterInterviewDetailsUC);
export const acceptInterviewController = new AcceptInterviewController(
  acceptInterviewUC,
);
export const rejectInterviewControlelr = new RejectInterviewController(
  rejectInterviewUC,
);
export const requestRescheduleController =
  new RequestInterviewRescheduleController(requestRescheduleInterviewUC);
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
