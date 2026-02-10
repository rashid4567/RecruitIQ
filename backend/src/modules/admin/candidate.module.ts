
import { GetRecruiterProfileUseCase } from "./Application/use-Cases/recruiter-management/get-recruiter-profile.usecase";
import { CandidateRepository } from "./Domain/repositories/candidate.repository";
import { RecruiterRepository } from "./Domain/repositories/recruiter.repository";
import { UserRepository } from "./Domain/repositories/user.repository";
import { MongooseCandidateRepository } from "./Infrastructure/repositories/mongoose-candidate.repository";
import { MongooseRecruiterRepository } from "./Infrastructure/repositories/mongoose-recruiter.repository";
import { MongooseUserRepository } from "./Infrastructure/repositories/mongoose-user.repository";
import { BlockUserController } from "./Presentation/controller/user-management/blockUser.controller";
import { UnblockUserController } from "./Presentation/controller/user-management/unblock.User.controller";
import { GetCandidateProfileController } from "./Presentation/controller/candidate-management/getcandidate.profile.controller";
import { GetCandidateAdminController } from "./Presentation/controller/candidate-management/getcandidatelist.controller";
import { GetRecruiterProfileController } from "./Presentation/controller/recruiter-management/getRecruiter.profile.controller";
import { GetRecruitersController } from "./Presentation/controller/recruiter-management/getRecruiters.controller";
import { RejectRecruiterController } from "./Presentation/controller/recruiter-management/reject.recruiter.controller";
import { VerifyRecruiterController } from "./Presentation/controller/recruiter-management/verifyRecruiter.controller";
import { GetCandidateUseCase } from "./Application/use-Cases/candidate-management/get-candidates.usecase";
import { GetCandidateprofileUseCase } from "./Application/use-Cases/candidate-management/get-candidate-profile.usecase";
import { GetRecruitersUseCase } from "./Application/use-Cases/recruiter-management/get-recruiters.usecase";
import { VerifyRecruiterUseCase } from "./Application/use-Cases/recruiter-management/verify-recruiter.usecase";
import { RejectRecruiterUseCase } from "./Application/use-Cases/recruiter-management/reject-recruiter.usecase";
import { BlockUserUseCase } from "./Application/use-Cases/user-management/block-user.usecase";
import { UnblockUserUseCase } from "./Application/use-Cases/user-management/unblock-user.usecase";

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
