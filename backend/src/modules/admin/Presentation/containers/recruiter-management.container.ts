import { GetRecruiterProfileUseCase } from "../../Application/use-Cases/recruiter-management/get-recruiter-profile.usecase";
import { GetRecruitersUseCase } from "../../Application/use-Cases/recruiter-management/get-recruiters.usecase";
import { RejectRecruiterUseCase } from "../../Application/use-Cases/recruiter-management/reject-recruiter.usecase";
import { VerifyRecruiterUseCase } from "../../Application/use-Cases/recruiter-management/verify-recruiter.usecase";
import { RecruiterRepository } from "../../Domain/repositories/recruiter.repository";
import { MongooseRecruiterRepository } from "../../Infrastructure/repositories/mongoose-recruiter.repository";
import { GetRecruiterProfileController } from "../controller/recruiter-management/getRecruiter.profile.controller";
import { GetRecruitersController } from "../controller/recruiter-management/getRecruiters.controller";
import { RejectRecruiterController } from "../controller/recruiter-management/reject.recruiter.controller";
import { VerifyRecruiterController } from "../controller/recruiter-management/verifyRecruiter.controller";

const recruiterRepo: RecruiterRepository = new MongooseRecruiterRepository();

const getRecruitersUC = new GetRecruitersUseCase(recruiterRepo);

const getRecruiterProfileUC = new GetRecruiterProfileUseCase(recruiterRepo);

const verifyRecruiterUC = new VerifyRecruiterUseCase(recruiterRepo);

const rejectRecruiterUC = new RejectRecruiterUseCase(recruiterRepo);

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
