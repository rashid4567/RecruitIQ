import { UserRepository } from "./domain/repositories/user.repository";
import { CompleteCandidateProfileUseCase } from "./application/use-cases/complete-candidate-profile.usecase";
import { GetCandidateProfileUseCase } from "./application/use-cases/get-candidate-profile.usecase";
import { UpdateCandidateProfileUseCase } from "./application/use-cases/update-candidate-profile.usecase";
import { CandidateRespository } from "./domain/repositories/candidate.repository";
import { MongooseCandidateRepository } from "./infrastructure/repositories/mongoose-candidate.repository";
import { MongooseUserRepository } from "./infrastructure/repositories/mongoose-user.repository";
import { CandidateController } from "./presentation/controller/completeProfile.controller";
import { getCandidateProfileController } from "./presentation/controller/getProfile.controller";
import { UpdateCandidateProfileController } from "./presentation/controller/updateProfile.controller";

const candidateRepository: CandidateRespository =
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
