import type { CandidateRepository } from "../../domain/repositories/candidate.repository";

export class UnblockCandidateUseCase{
    private readonly CandidateRepo : CandidateRepository;
    constructor(
        candidateRepo : CandidateRepository
    ){
        this.CandidateRepo = candidateRepo
    }

    async execute(candidateId : string):Promise<void>{
     
        return this.CandidateRepo.unblockCandidate(candidateId)
    }
}