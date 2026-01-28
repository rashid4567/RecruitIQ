import { RecruiterProfileRepository } from "./domain/repositories/recruiter.repository";
//import { PasswordServicePort } from "./application/ports/password.service.port";
import { UserServicePort } from "./application/ports/user.service.port";
import { GetRecruiterProfileUseCase } from "./application/useCase/get-recruiter-profile.usecase";
import { UpdateRecruiterProfileUseCase } from "./application/useCase/update-recruiter-profile.usecase";
import { CompleteRecruiterProfileUseCase } from "./application/useCase/complete-recruiter-profile.usecase";
import { UpdateRecruiterPasswordUserCase } from "./application/useCase/update-recruiter-password.usecase";
import { MongooseRecruiterProfileRepository } from "./infrastructure/repositories/mongoose-recruiter.repository";
//import { PasswordService } from "./infrastructure/service/password.service";
import { UserService } from "./infrastructure/service/user.service";
import {  UpdateRecruiterProfileController } from "./presentation/controller/updateProfile.controller";
//import { OTPService } from "../auth/infrastructure/service/otp.service";
//import { OTPServicePort } from "../auth/application/ports/otp.service.ports";
import { RecruiterEmailUpdateUseCase } from "./application/useCase/request-recruiter-email.usecase";
import { UserRepository } from "./domain/repositories/user.entity";
import { MongooseUserRepository } from "./infrastructure/repositories/mongoose-user.repository";
import { CompleteRecruiterProfileController } from "./presentation/controller/completeProfile.controller";
import { GetRecruiterProfileController } from "./presentation/controller/getProfile.controller";
//import { VerifyRecruiterEmailUpdateUseCase } from "./application/useCase/verify-recruiter-email.usecse";

const recruiterRepository: RecruiterProfileRepository =
  new MongooseRecruiterProfileRepository();
const userRepository : UserRepository = new MongooseUserRepository();

//const passwordService: PasswordServicePort = new PasswordService();
const userService: UserServicePort = new UserService();
//const otpService: OTPServicePort = new OTPService();
const getRecruiterProfileUC = new GetRecruiterProfileUseCase(
  recruiterRepository,
  userRepository,
);

const updateRecruiterProfileUC = new UpdateRecruiterProfileUseCase(
  recruiterRepository,
  userRepository,
);

const completeRecruiterProfileUC = new CompleteRecruiterProfileUseCase(
  recruiterRepository,
);

// const updateRecruiterPasswordUC = new UpdateRecruiterPasswordUserCase(
//   userService,
//   passwordService,
// );

// const requestEmailUpdateUC = new RecruiterEmailUpdateUseCase(
//   userService,
//   otpService,
// );

// const verifyEmailUpdateUC = new VerifyRecruiterEmailUpdateUseCase(
//   userService,
//   otpService,
// );

export const updaterecruiterController = new UpdateRecruiterProfileController(
  // getRecruiterProfileUC,
  updateRecruiterProfileUC,
  // completeRecruiterProfileUC,
  // updateRecruiterPasswordUC,
  // requestEmailUpdateUC,
  // verifyEmailUpdateUC,
);

export const  completeProfileController = new CompleteRecruiterProfileController(
  completeRecruiterProfileUC,
)

export const getRecruiterProfile = new GetRecruiterProfileController(
  getRecruiterProfileUC
)
