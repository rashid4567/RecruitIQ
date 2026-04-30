import type { CandidateRepository } from "../../domain/repositories/candidate.repository";
import type { GetCandidatesQuery } from "../dto/get-candidates.query";

export class GetCandidateListUseCase{
    private readonly candiateRepo : CandidateRepository
    constructor(
        candidateRepo : CandidateRepository
    ){
        this.candiateRepo = candidateRepo;
    }
    async execute(query : GetCandidatesQuery){
        return this.candiateRepo.getCandidates(query)
    }
}