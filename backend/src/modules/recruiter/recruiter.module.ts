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

import { RecruiterController } from "./presentation/recruiter.controller";
const recruiterRepository: RecruiterProfileRepository =
  new MongooseRecruiterProfileRepository();

const passwordService: PasswordServicePort = new PasswordService();
const userService: UserServicePort = new UserService();
const getRecruiterProfileUC = new GetRecruiterProfileUserCase(
  recruiterRepository
);

const updateRecruiterProfileUC = new UpdateRecruiterProfileUseCase(
  recruiterRepository,
  userService
);

const completeRecruiterProfileUC = new CompleteRecruiterProfileUseCase(
  recruiterRepository
);

const updateRecruiterPasswordUC = new UpdateRecruiterPasswordUserCase(
  userService,
  passwordService
);

export const recruiterController = new RecruiterController(
  getRecruiterProfileUC,
  updateRecruiterProfileUC,
  completeRecruiterProfileUC,
  updateRecruiterPasswordUC
);

