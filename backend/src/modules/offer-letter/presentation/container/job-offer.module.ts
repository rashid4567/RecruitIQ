import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { MongooseUserRepository } from "../../../auth/infrastructure/repositories/mongoose-user.repository";
import { sendEmailByEventUC } from "../../../email/presentation/container/email-template.container";
import { JobApplicationRepository } from "../../../job-application/domain/repository/job-application.repository";
import { MongooseJobApplicationRepository } from "../../../job-application/infrastructure/repository/MongooseJobApplicationRepository";
import { JobRepository } from "../../../job/domain/repositories/job.repository";
import { MongooseJobRepository } from "../../../job/infrastructure/repositories/mongoose-job.repository";
import { AcceptOfferUseCase } from "../../application/usecase/candidate/AcceptOfferUseCase";
import { GetCandidateOfferUseCase } from "../../application/usecase/candidate/GetCandidateOffersUseCase";
import { RejectOfferUseCase } from "../../application/usecase/candidate/RejectOfferUseCase";
import { CreateOfferUseCase } from "../../application/usecase/recruiter/CreateOffer.usecase";
import { GetOfferDetailsUseCase } from "../../application/usecase/recruiter/GetOfferDetailsUseCase";
import { GetRecruiterOffersUseCase } from "../../application/usecase/recruiter/GetRecruiterOffersUseCase";
import { OfferRepository } from "../../domain/repository/offer-letter.repository";
import { MongooseOfferRepository } from "../../infrastructure/repository/mongoose.offer-letter.Repository";
import { AcceptOfferController } from "../controller/candidate/AcceptOffer.controller";
import { GetCandidateOfferController } from "../controller/candidate/getCandidateoffer.controller";
import { RejectOfferController } from "../controller/candidate/rejectOffer.controller";
import { CreateOfferLetterController } from "../controller/recruiter/createOffer.controller";
import { GetOfferDetailsController } from "../controller/recruiter/GetOfferDetails.controller";
import { GetRecruiterOffersController } from "../controller/recruiter/GetRecruiterOffers.controller";
import { createNotificationUC } from "../../../notification/presentation/container/notification.module";
import { MongooseInterviewRepository } from "../../../interview/infrastructure/repository/mongooseInterview.repository";
import { InterviewRepository } from "../../../interview/domain/repository/interview.repository";

const offerRepo: OfferRepository = new MongooseOfferRepository();
const applicationRepo: JobApplicationRepository =
  new MongooseJobApplicationRepository();
const jobRepo: JobRepository = new MongooseJobRepository();
const userRepo: UserRepository = new MongooseUserRepository();
const interviewRepo : InterviewRepository = new MongooseInterviewRepository();
const sendEmailByEventuc = sendEmailByEventUC;
const createNotificationuc = createNotificationUC;

const getRecruiterOffersUC = new GetRecruiterOffersUseCase(offerRepo);
const getRecruiterofferDetailsUC = new GetOfferDetailsUseCase(offerRepo);
const createofferUC = new CreateOfferUseCase(
  offerRepo,
  applicationRepo,
  jobRepo,
  userRepo,
  interviewRepo,
  sendEmailByEventuc,
  createNotificationuc,
);

const getCandidateofferUC = new GetCandidateOfferUseCase(offerRepo);
const acceptOfferUC = new AcceptOfferUseCase(offerRepo);
const rejectOfferUC = new RejectOfferUseCase(offerRepo);

export const createOfferController = new CreateOfferLetterController(
  createofferUC,
);
export const getrecruiterOffersController = new GetRecruiterOffersController(
  getRecruiterOffersUC,
);
export const getofferDetailsController = new GetOfferDetailsController(
  getRecruiterofferDetailsUC,
);

export const getcandidateofferController = new GetCandidateOfferController(
  getCandidateofferUC,
);
export const acceptCandidateOfferController = new AcceptOfferController(
  acceptOfferUC,
);
export const rejectcandidateofferController = new RejectOfferController(
  rejectOfferUC,
);
