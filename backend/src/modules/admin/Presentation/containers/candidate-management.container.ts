import { GetCandidateprofileUseCase } from "../../Application/use-Cases/candidate-management/get-candidate-profile.usecase";
import { GetCandidateUseCase } from "../../Application/use-Cases/candidate-management/get-candidates.usecase";
import { CandidateRepository } from "../../Domain/repositories/candidate.repository";
import { MongooseCandidateRepository } from "../../Infrastructure/repositories/mongoose-candidate.repository";
import { GetCandidateProfileController } from "../controller/candidate-management/getcandidate.profile.controller";
import { GetCandidateAdminController } from "../controller/candidate-management/getcandidatelist.controller";

const candidateRepo: CandidateRepository = new MongooseCandidateRepository();

const getCandidatesUC = new GetCandidateUseCase(candidateRepo);

const getCandidateProfileUC = new GetCandidateprofileUseCase(candidateRepo);

export const getCandidatesController = new GetCandidateAdminController(
  getCandidatesUC,
);

export const getCandidateProfileController = new GetCandidateProfileController(
  getCandidateProfileUC,
);
