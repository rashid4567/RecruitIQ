import { CandidateRepository } from "../../../candidate/domain/repositories/candidate.repository";
import { MongooseCandidateRepository } from "../../../candidate/infrastructure/repositories/mongoose-candidate.repository";

import { ResumeRepository } from "../../domain/repository/resume.repository";
import { FileStorageRepository } from "../../domain/repository/fileStorage.repository";

import { MongooseResumeRepository } from "../../infrastructure/repository/mongoose.resume.repository";
import { S3FileStorageRepository } from "../../infrastructure/storage/s3-file-storage.repository";

import { UploadResumeUseCase } from "../../application/usecase/UploadResumeUseCase";
import { DeleteResumeUseCase } from "../../application/usecase/DeleteResumeUseCase";
import { GetResumeByCandidateUseCase } from "../../application/usecase/GetResumeByCandidateUseCase";
import { GetResumeByIdUseCase } from "../../application/usecase/GetResumeByIdUseCase";

import { UploadResumeController } from "../controller/uploadResume.controller";
import { DeleteResumeController } from "../controller/deleteResume.controller";
import { DeleteMyResumeController } from "../controller/deletemyResume.controller";
import { GetResumeByCandidateController } from "../controller/GetResumeByCandidate.controller";
import { GetResumeByIdController } from "../controller/GetResumeById.controller";

import { DownloadResumeUseCase } from "../../application/usecase/DownloadResumeUseCase";
import { DownloadResumeController } from "../controller/download.resume.controller";
import { ResumeTextExtractorService } from "../../infrastructure/services/resume-text-extractor.service";
import { ResumeParserService } from "../../infrastructure/services/resume-parser.service";
import { openai } from "../../../../config/openai";
import { ParseResumeUseCase } from "../../application/usecase/ParseResumeUseCase";
import { ParseResumeController } from "../controller/parseResume.controller";
import { AnalyzeApplicationUC, applicationRepo } from "../../../job-application/presenatation/container/JobApplication.module";
const resumeRepo: ResumeRepository = new MongooseResumeRepository();
const candidateRepo: CandidateRepository = new MongooseCandidateRepository();
const fileStorage: FileStorageRepository = new S3FileStorageRepository();
const resumeTextExtractor = new ResumeTextExtractorService();
const resumeParser = new ResumeParserService(openai);


const deleteResumeUC = new DeleteResumeUseCase(resumeRepo, fileStorage);
const getResumeByCandidateUC = new GetResumeByCandidateUseCase(resumeRepo);
const parseResumeUseCase = new ParseResumeUseCase(
  resumeRepo,
  resumeTextExtractor,
  resumeParser,
  applicationRepo,
  AnalyzeApplicationUC
);
const getResumeByIdUC = new GetResumeByIdUseCase(resumeRepo);
const DownloadResumeUC = new DownloadResumeUseCase(resumeRepo, fileStorage);
const uploadResumeUC = new UploadResumeUseCase(
  resumeRepo,
  candidateRepo,
  fileStorage,
parseResumeUseCase
);
export const uploadResumeController = new UploadResumeController(
  uploadResumeUC,
);
export const deleteResumeController = new DeleteResumeController(
  deleteResumeUC,
);
export const deleteMyResumeController = new DeleteMyResumeController(
  deleteResumeUC,
  getResumeByCandidateUC,
);
export const parseResumeController = new ParseResumeController(
  parseResumeUseCase,
);
export const getResumeByCandidateController =
  new GetResumeByCandidateController(getResumeByCandidateUC);
export const getResumeByIdController = new GetResumeByIdController(
  getResumeByIdUC,
);

export const DownloadResumecontroller = new DownloadResumeController(
  DownloadResumeUC,
);
