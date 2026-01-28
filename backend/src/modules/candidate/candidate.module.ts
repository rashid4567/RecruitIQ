import { UserRepository } from "./domain/repositories/user.repository";
import { passwordServicePort } from "./application/ports/password.service.port";
import { UserServicePort } from "./application/ports/user.service.port";
import { CompleteCandidateProfileUseCase } from "./application/use-cases/complete-candidate-profile.usecase";
import { GetCandidateProfileUseCase } from "./application/use-cases/get-candidate-profile.usecase";
import { UpdateCandidateProfileUseCase } from "./application/use-cases/update-candidate-profile.usecase";
//import { updatePasswordUseCase } from "./application/use-cases/update-password.usecase";
import { CandidateRespository } from "./domain/repositories/candidate.repository";
import { MongooseCandidateRepository } from "./infrastructure/repositories/mongoose-candidate.repository";
import { MongooseUserRepository } from "./infrastructure/repositories/mongoose-user.repository";
//import { PasswordService } from "./infrastructure/service/password.service";
// import { UserService } from "./infrastructure/service/user.service";
import { CandidateController } from "./presentation/controller/completeProfile.controller";
import { getCandidateProfileController } from "./presentation/controller/getProfile.controller";
import { UpdateCandidateProfileController } from "./presentation/controller/updateProfile.controller";
//import { RequestCandidateEmailUpdateUseCase } from "./application/use-cases/request-candidate-emailUpdate.usecase";
// import { OTPServicePort } from "../auth/application/ports/otp.service.ports";
// import { OTPService } from "../auth/infrastructure/service/otp.service";
//import { verifyCadndidateEmailUpdateUseCase } from "./application/use-cases/verify-candidate-email.usecse";

const candidateRepository: CandidateRespository =
  new MongooseCandidateRepository();
const userRepository: UserRepository = new MongooseUserRepository();
//const passwordService : passwordServicePort = new PasswordService();
// const userService : UserServicePort = new UserService();
// const otpService : OTPServicePort = new OTPService();

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
//const updatePasswordUC = new updatePasswordUseCase(userService, passwordService);
//const requestEmailUpdateUC = new RequestCandidateEmailUpdateUseCase(userRepository, otpService)
//const verifyEmaolupdateUc = new verifyCadndidateEmailUpdateUseCase(otpService, userRepository)

export const candidateController = new CandidateController(
  completeCandidateProfileUC,
  //updatePasswordUC,
  //requestEmailUpdateUC,
  //verifyEmaolupdateUc,
);

export const getprofileController = new getCandidateProfileController(
  getCandidateProfileUC,
);

export const updateprofileController = new UpdateCandidateProfileController(
  updateCandidateProfileUC,
);
