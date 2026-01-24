import { RecruiterProfileRepository } from "./domain/repositories/recruiter.repository";
import { PasswordServicePort } from "./application/ports/password.service.port";
import { UserServicePort } from "./application/ports/user.service.port";
import { GetRecruiterProfileUserCase } from "./application/useCase/get-recruiter-profile.usecase";
import { UpdateRecruiterProfileUseCase } from "./application/useCase/update-recruiter-profile.usecase";
import { CompleteRecruiterProfileUseCase } from "./application/useCase/complete-recruiter-profile.usecase";
import { UpdateRecruiterPasswordUserCase } from "./application/useCase/update-recruiter-password.usecase";
import { MongooseRecruiterProfileRepository } from "./infrastructure/repositories/mongoose-recruiter.repository";
import { PasswordService } from "./infrastructure/service/password.service";
import { UserService } from "./infrastructure/service/user.service";
import { RecruiterController } from "./presentation/controller/recruiter.controller";
import { OTPService } from "../auth/infrastructure/service/otp.service";
import { OTPServicePort } from "../auth/application/ports/otp.service.ports";
import { RecruiterEmailUpdateUseCase } from "./application/useCase/request-recruiter-email.usecase";
import { VerifyRecruiterEmailUpdateUseCase } from "./application/useCase/verify-recruiter-email.usecse";

const recruiterRepository: RecruiterProfileRepository =
  new MongooseRecruiterProfileRepository();

const passwordService: PasswordServicePort = new PasswordService();
const userService: UserServicePort = new UserService();
const otpService: OTPServicePort = new OTPService();
const getRecruiterProfileUC = new GetRecruiterProfileUserCase(
  recruiterRepository,
  userService,
);

const updateRecruiterProfileUC = new UpdateRecruiterProfileUseCase(
  recruiterRepository,
  userService,
);

const completeRecruiterProfileUC = new CompleteRecruiterProfileUseCase(
  recruiterRepository,
);

const updateRecruiterPasswordUC = new UpdateRecruiterPasswordUserCase(
  userService,
  passwordService,
);

const requestEmailUpdateUC = new RecruiterEmailUpdateUseCase(
  userService,
  otpService,
);

const verifyEmailUpdateUC = new VerifyRecruiterEmailUpdateUseCase(
  userService,
  otpService,
);

export const recruiterController = new RecruiterController(
  getRecruiterProfileUC,
  updateRecruiterProfileUC,
  completeRecruiterProfileUC,
  updateRecruiterPasswordUC,
  requestEmailUpdateUC,
  verifyEmailUpdateUC,
);
