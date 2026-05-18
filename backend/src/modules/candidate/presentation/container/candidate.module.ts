import { UserRepository } from "../../domain/repositories/user.repository"; 
import { CompleteCandidateProfileUseCase } from "../../application/use-cases/profile/complete-candidate-profile.usecase";
import { GetCandidateProfileUseCase } from "../../application/use-cases/profile/get-candidate-profile.usecase";
import { UpdateCandidateProfileUseCase } from "../../application/use-cases/profile/update-candidate-profile.usecase";
import { CandidateRepository } from "../../domain/repositories/candidate.repository";
import { MongooseCandidateRepository } from "../../infrastructure/repositories/mongoose-candidate.repository";
import { MongooseUserRepository } from "../../infrastructure/repositories/mongoose-user.repository";
import { CandidateController } from "../../presentation/controller/completeProfile.controller";
import { getCandidateProfileController } from "../../presentation/controller/getProfile.controller";
import { UpdateCandidateProfileController } from "../../presentation/controller/updateProfile.controller";

const candidateRepository: CandidateRepository =
  new MongooseCandidateRepository();
const userRepository: UserRepository = new MongooseUserRepository();

const getCandidateProfileUC = new GetCandidateProfileUseCase(
  candidateRepository,
  userRepository,
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

export const getprofileController = new getCandidateProfileController(
  getCandidateProfileUC,
);

export const updateprofileController = new UpdateCandidateProfileController(
  updateCandidateProfileUC,
);
