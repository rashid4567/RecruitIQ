import type { CandidateRepository } from "../../domain/repositories/candidate.repository";

export class UnblockCandidateUseCase{
    private readonly CandidateRepo : CandidateRepository;
    constructor(
        candidateRepo : CandidateRepository
    ){
        this.CandidateRepo = candidateRepo
    }

    async execute(candidateId : string):Promise<void>{
          if(typeof candidateId !== "string"){
            throw new Error('Invalid candidateid  : must be string')
        }
        return this.CandidateRepo.unblockCandidate(candidateId)
    }
}