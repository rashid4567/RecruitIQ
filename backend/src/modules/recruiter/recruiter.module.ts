import { RecruiterProfileRepository } from "./domain/repositories/recruiter.repository";
import { GetRecruiterProfileUseCase } from "./application/useCase/get-recruiter-profile.usecase";
import { UpdateRecruiterProfileUseCase } from "./application/useCase/update-recruiter-profile.usecase";
import { CompleteRecruiterProfileUseCase } from "./application/useCase/complete-recruiter-profile.usecase";
import { MongooseRecruiterProfileRepository } from "./infrastructure/repositories/mongoose-recruiter.repository";
import { UpdateRecruiterProfileController } from "./presentation/controller/updateProfile.controller";
import { UserRepository } from "./domain/repositories/user.entity";
import { MongooseUserRepository } from "./infrastructure/repositories/mongoose-user.repository";
import { CompleteRecruiterProfileController } from "./presentation/controller/completeProfile.controller";
import { GetRecruiterProfileController } from "./presentation/controller/getProfile.controller";

const recruiterRepository: RecruiterProfileRepository =
  new MongooseRecruiterProfileRepository();
const userRepository: UserRepository = new MongooseUserRepository();

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

export const updaterecruiterController = new UpdateRecruiterProfileController(
  updateRecruiterProfileUC,
);

export const completeProfileController = new CompleteRecruiterProfileController(
  completeRecruiterProfileUC,
);

export const getRecruiterProfile = new GetRecruiterProfileController(
  getRecruiterProfileUC,
);
