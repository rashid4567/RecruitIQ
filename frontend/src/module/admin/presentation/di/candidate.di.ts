
import { BlockCandidateUseCase } from "../../application/useCases/blockCanddiate.use-case";
import { GetCandidateListUseCase } from "../../application/useCases/get-candidates.usecase";
import { UnblockCandidateUseCase } from "../../application/useCases/unblockCanddiate.use-case";
import { ApiCandidateRepository } from "../../infrastructure/repositories/ApiCandidateRepository";

const candidateRepo = new ApiCandidateRepository();

export const GetCandidateListUC = new GetCandidateListUseCase(candidateRepo)
export const blockCandidateUC = new BlockCandidateUseCase(candidateRepo);
export const unblockCandidateUC = new UnblockCandidateUseCase(candidateRepo);