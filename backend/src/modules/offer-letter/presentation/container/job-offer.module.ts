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
import { FileStorageRepository } from "../../../resume/domain/repository/fileStorage.repository";
import { S3FileStorageRepository } from "../../../resume/infrastructure/storage/s3-file-storage.repository";
import { UploadSignatureUseCase } from "../../application/usecase/candidate/UploadSignatureUseCase";
import { CandidateRepository } from "../../../candidate/domain/repositories/candidate.repository";
import { MongooseCandidateRepository } from "../../../candidate/infrastructure/repositories/mongoose-candidate.repository";
import { UploadSignatureController } from "../controller/candidate/uploadSignature.controller";

const offerRepo: OfferRepository = new MongooseOfferRepository();
const applicationRepo: JobApplicationRepository =
  new MongooseJobApplicationRepository();
const jobRepo: JobRepository = new MongooseJobRepository();
const candidateRepo :  CandidateRepository = new MongooseCandidateRepository();
const userRepo: UserRepository = new MongooseUserRepository();
const fileStorageRepo  :FileStorageRepository = new S3FileStorageRepository();
const interviewRepo: InterviewRepository = new MongooseInterviewRepository();
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
const uploadSignatureUC = new UploadSignatureUseCase(candidateRepo,fileStorageRepo)
const getCandidateofferUC = new GetCandidateOfferUseCase(offerRepo);
const acceptOfferUC = new AcceptOfferUseCase(
  offerRepo,
  createNotificationuc,
  jobRepo,
);
const rejectOfferUC = new RejectOfferUseCase(
  offerRepo,
  createNotificationuc,
  jobRepo,
);

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

export const uploadSignatureController = new UploadSignatureController(uploadSignatureUC)
export const acceptCandidateOfferController = new AcceptOfferController(
  acceptOfferUC,
);
export const rejectcandidateofferController = new RejectOfferController(
  rejectOfferUC,
);
