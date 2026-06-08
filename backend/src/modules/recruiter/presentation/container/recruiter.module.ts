import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { GetRecruiterProfileUseCase } from "../../application/useCase/profile/get-recruiter-profile.usecase";
import { UpdateRecruiterProfileUseCase } from "../../application/useCase/profile/update-recruiter-profile.usecase";
import { CompleteRecruiterProfileUseCase } from "../../application/useCase/profile/complete-recruiter-profile.usecase";
import { MongooseRecruiterProfileRepository } from "../../infrastructure/repositories/mongoose-recruiter.repository";
import { UpdateRecruiterProfileController } from "../../presentation/controller/updateProfile.controller";
import { UserRepository } from "../../domain/repositories/user.entity";
import { MongooseUserRepository } from "../../infrastructure/repositories/mongoose-user.repository";
import { CompleteRecruiterProfileController } from "../../presentation/controller/completeProfile.controller";
import { GetRecruiterProfileController } from "../../presentation/controller/getProfile.controller";
import { FileStorageRepository } from "../../../resume/domain/repository/fileStorage.repository";
import { S3FileStorageRepository } from "../../../resume/infrastructure/storage/s3-file-storage.repository";

const recruiterRepository: RecruiterProfileRepository =
  new MongooseRecruiterProfileRepository();
const userRepository: UserRepository = new MongooseUserRepository();
const fileStorageRepo : FileStorageRepository = new S3FileStorageRepository();

const getRecruiterProfileUC = new GetRecruiterProfileUseCase(
  recruiterRepository,
  userRepository,
  fileStorageRepo
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
