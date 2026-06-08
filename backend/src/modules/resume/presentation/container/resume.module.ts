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
const resumeRepo: ResumeRepository = new MongooseResumeRepository();
const candidateRepo: CandidateRepository = new MongooseCandidateRepository();
const fileStorage: FileStorageRepository = new S3FileStorageRepository();
const uploadResumeUC = new UploadResumeUseCase(
  resumeRepo,
  candidateRepo,
  fileStorage,
);
const deleteResumeUC = new DeleteResumeUseCase(resumeRepo, fileStorage);
const getResumeByCandidateUC = new GetResumeByCandidateUseCase(resumeRepo);

const getResumeByIdUC = new GetResumeByIdUseCase(resumeRepo);
const DownloadResumeUC = new DownloadResumeUseCase(resumeRepo, fileStorage)
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
export const getResumeByCandidateController =
  new GetResumeByCandidateController(getResumeByCandidateUC);
export const getResumeByIdController = new GetResumeByIdController(
  getResumeByIdUC,
);

export const DownloadResumecontroller = new DownloadResumeController(DownloadResumeUC)