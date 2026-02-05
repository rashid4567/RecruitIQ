import { BlockUserUseCase } from "./Application/use-Cases/block-user.usecase";
import { UnblockUserUseCase } from "./Application/use-Cases/unblock-user.usecase";
import { GetCandidateprofileUseCase } from "./Application/use-Cases/get-candidate-profile.usecase";
import { GetCandidateUseCase } from "./Application/use-Cases/get-candidates.usecase";
import { GetRecruiterProfileUseCase } from "./Application/use-Cases/get-recruiter-profile.usecase";
import { GetRecruitersUseCase } from "./Application/use-Cases/get-recruiters.usecase";
import { RejectRecruiterUseCase } from "./Application/use-Cases/reject-recruiter.usecase";
import { VerifyRecruiterUseCase } from "./Application/use-Cases/verify-recruiter.usecase";

import { CandidateRepository } from "./Domain/repositories/candidate.repository";
import { RecruiterRepository } from "./Domain/repositories/recruiter.repository";
import { UserRepository } from "./Domain/repositories/user.repository";

import { MongooseCandidateRepository } from "./Infrastructure/repositories/mongoose-candidate.repository";
import { MongooseRecruiterRepository } from "./Infrastructure/repositories/mongoose-recruiter.repository";
import { MongooseUserRepository } from "./Infrastructure/repositories/mongoose-user.repository";

import { BlockUserController } from "./Presentation/controller/blockUser.controller";
import { UnblockUserController } from "./Presentation/controller/unblock.User.controller";
import { GetCandidateProfileController } from "./Presentation/controller/getcandidate.profile.controller";
import { GetCandidateAdminController } from "./Presentation/controller/getcandidatelist.controller";
import { GetRecruiterProfileController } from "./Presentation/controller/getRecruiter.profile.controller";
import { GetRecruitersController } from "./Presentation/controller/getRecruiters.controller";
import { RejectRecruiterController } from "./Presentation/controller/reject.recruiter.controller";
import { VerifyRecruiterController } from "./Presentation/controller/verifyRecruiter.controller";

const candidateRepo: CandidateRepository = new MongooseCandidateRepository();
const recruiterRepo: RecruiterRepository = new MongooseRecruiterRepository();
const userRepo: UserRepository = new MongooseUserRepository();

const blockUserUC = new BlockUserUseCase(userRepo);
const unblockUserUC = new UnblockUserUseCase(userRepo);

const getCandidateUC = new GetCandidateUseCase(candidateRepo);
const getCandidateProfileUC = new GetCandidateprofileUseCase(candidateRepo);

const getRecruitersUC = new GetRecruitersUseCase(recruiterRepo);
const getRecruiterProfileUC = new GetRecruiterProfileUseCase(recruiterRepo);

const verifyRecruiterUC = new VerifyRecruiterUseCase(recruiterRepo);
const rejectRecruiterUC = new RejectRecruiterUseCase(recruiterRepo);

export const blockUserController = new BlockUserController(blockUserUC);
export const unblockUserController = new UnblockUserController(unblockUserUC);

export const getCandidatesController = new GetCandidateAdminController(
  getCandidateUC,
);

export const getCandidateProfileController = new GetCandidateProfileController(
  getCandidateProfileUC,
);

export const getRecruitersController = new GetRecruitersController(
  getRecruitersUC,
);

export const getRecruiterProfileController = new GetRecruiterProfileController(
  getRecruiterProfileUC,
);

export const verifyRecruiterController = new VerifyRecruiterController(
  verifyRecruiterUC,
);

export const rejectRecruiterController = new RejectRecruiterController(
  rejectRecruiterUC,
);
