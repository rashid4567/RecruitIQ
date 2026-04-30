



import { GetCandidateListUseCase } from "../../application/useCases/candidate-management/get-candidates.usecase";
import { GetCandidateProfileUseCase } from "../../application/useCases/candidate-management/getcandidate.ProfileUseCase";

import { ApiCandidateRepository } from "../../infrastructure/repositories/ApiCandidateRepository";

const candidateRepo = new ApiCandidateRepository();

export const GetCandidateListUC = new GetCandidateListUseCase(candidateRepo)
export const getCandidateProfileUC = new GetCandidateProfileUseCase(candidateRepo);