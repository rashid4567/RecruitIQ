import { CandidateController } from "../../candidate/presentation/controller/completeProfile.controller";
import { BlockCandidateUseCase } from "./Application/use-Cases/block-candidate.usecase";
import { GetCandidateprofileUseCase } from "./Application/use-Cases/get-candidate-profile.usecase";
import { GetcandidateUseCase } from "./Application/use-Cases/get-candidates.usecase";
import { UnblockCandidteUseCase } from "./Application/use-Cases/unblock-candidate.usecase";
import { CandidateRepository } from "./Domain/repositories/candidate.repository";
import { MongooseCandidateRepositort } from "./Infrastructure/repositories/mongoose-candidate.repository";
import { CandidateAdminContoller } from "./Presentation/candidate.controller";

const candidteRepo : CandidateRepository = new MongooseCandidateRepositort();
const candidateUC = new GetcandidateUseCase(candidteRepo);
const candidateProfileUC = new GetCandidateprofileUseCase(candidteRepo);
const BlockCandidateUC = new BlockCandidateUseCase(candidteRepo);
const unBlockCandidateUC = new UnblockCandidteUseCase(candidteRepo);

export const candidateController = new CandidateAdminContoller(
    candidateUC,
    candidateProfileUC,
    BlockCandidateUC,
    unBlockCandidateUC,
)