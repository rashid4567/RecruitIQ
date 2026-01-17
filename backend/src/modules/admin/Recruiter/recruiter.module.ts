import { MongooseRecruiterRepository } from "./infrastructure/repositories/mongoose-recruiter.repository";
import { RecruiterRepository } from "./Domain/repositories/recruiter.repository";
import { GetRecruitersUseCase } from "./Application/use-Cases/get-recruiters.usecase";
import { RecruiterAdminController } from "./presentation/recruiter.controller";
import { GetRecruiterProfileUseCase } from "./Application/use-Cases/get-recruiter-profile.usecase";
import { BlockRecruiterUseCase } from "./Application/use-Cases/block-recruiter.usecase";
import { UnblockRecruiterUseCase } from "./Application/use-Cases/unblock-recruiter.usecase";
import { VerifyRecruiterUseCase } from "./Application/use-Cases/verify-recruiter.usecase";

const RecruiterRepo : RecruiterRepository = new MongooseRecruiterRepository();

const getRecruiterUC = new GetRecruitersUseCase(RecruiterRepo)
const getRecruiterProfileUC = new GetRecruiterProfileUseCase(RecruiterRepo);
const blockRecruiterUC = new BlockRecruiterUseCase(RecruiterRepo);
const unblockrRecruiterUC = new UnblockRecruiterUseCase(RecruiterRepo);
const verifyRecruiterUC = new VerifyRecruiterUseCase(RecruiterRepo)
export const recruiterAdminController = new RecruiterAdminController(
    getRecruiterUC,
    getRecruiterProfileUC,
     verifyRecruiterUC,
     blockRecruiterUC,
    unblockrRecruiterUC,
)
