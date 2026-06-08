import { UserRepository } from "../../domain/repositories/user.repository"; 
import { CompleteCandidateProfileUseCase } from "../../application/use-cases/profile/complete-candidate-profile.usecase";
import { GetCandidateProfileUseCase } from "../../application/use-cases/profile/get-candidate-profile.usecase";
import { UpdateCandidateProfileUseCase } from "../../application/use-cases/profile/update-candidate-profile.usecase";
import { CandidateRepository } from "../../domain/repositories/candidate.repository";
import { MongooseCandidateRepository } from "../../infrastructure/repositories/mongoose-candidate.repository";
import { MongooseUserRepository } from "../../infrastructure/repositories/mongoose-user.repository";
import { CandidateController } from "../../presentation/controller/completeProfile.controller";
import { GetCandidateProfileController } from "../../presentation/controller/getProfile.controller";
import { UpdateCandidateProfileController } from "../../presentation/controller/updateProfile.controller";
import { ResumeRepository } from "../../../resume/domain/repository/resume.repository";
import { MongooseResumeRepository } from "../../../resume/infrastructure/repository/mongoose.resume.repository";
import { FileStorageRepository } from "../../../resume/domain/repository/fileStorage.repository";
import { S3FileStorageRepository } from "../../../resume/infrastructure/storage/s3-file-storage.repository";

const candidateRepository: CandidateRepository =
  new MongooseCandidateRepository();
const userRepository: UserRepository = new MongooseUserRepository();
const resumeRepository : ResumeRepository = new MongooseResumeRepository();
const fileStorageRepo : FileStorageRepository = new S3FileStorageRepository()

const getCandidateProfileUC = new GetCandidateProfileUseCase(
  candidateRepository,
  userRepository,
  resumeRepository,
  fileStorageRepo
);
const updateCandidateProfileUC = new UpdateCandidateProfileUseCase(
  candidateRepository,
  userRepository,
);
const completeCandidateProfileUC = new CompleteCandidateProfileUseCase(
  candidateRepository,
);

export const candidateController = new CandidateController(
  completeCandidateProfileUC,
);

export const getprofileController = new GetCandidateProfileController(
  getCandidateProfileUC,
);

export const updateprofileController = new UpdateCandidateProfileController(
  updateCandidateProfileUC,
);
