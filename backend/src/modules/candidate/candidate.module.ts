import { UserRepository } from "./domain/repositories/user.repository";
import { passwordServicePort } from "./application/ports/password.service.port";
import { UserServicePort } from "./application/ports/user.service";
import { CompleteProfileCandidateProfileUseCase } from "./application/use-cases/complete-candidate-profile.usecase";
import { GetCandidateProfileUseCase } from "./application/use-cases/get-candidate-profile.usecase";
import { UpdateCandidateProfileUseCase } from "./application/use-cases/update-candidate-profile.usecase";
import { updatePasswordUseCase } from "./application/use-cases/update-password.usecase";
import { CandidateRespository } from "./domain/repositories/candidate.repository";
import { MongooseCandidateRepository } from "./infrastructure/repositories/mongoose-candidate.repository";
import { MongooseUserRepository } from "./infrastructure/repositories/mongoose-user.repository";
import { PasswordService } from "./infrastructure/service/password.service";
import { UserService } from "./infrastructure/service/user.service";
import { CandidateController } from "./presentation/candidate.controller";

const candidateRepository : CandidateRespository = new MongooseCandidateRepository();
const userRepository :  UserRepository = new MongooseUserRepository();
const passwordService : passwordServicePort = new PasswordService();
const userService : UserServicePort = new UserService();

const getCandidateProfileUC = new GetCandidateProfileUseCase(candidateRepository, userRepository);
const updateCandidateProfileUC = new UpdateCandidateProfileUseCase(candidateRepository, userRepository)
const completeCandidateProfileUC = new CompleteProfileCandidateProfileUseCase(candidateRepository);
const updatePasswordUC = new updatePasswordUseCase(userService, passwordService);

export const candidateController = new CandidateController(
    getCandidateProfileUC,
  updateCandidateProfileUC,
  completeCandidateProfileUC,
  updatePasswordUC

)