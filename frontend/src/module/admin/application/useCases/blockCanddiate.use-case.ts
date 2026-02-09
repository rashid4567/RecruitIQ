import type { CandidateRepository } from "../../domain/repositories/candidate.repository";

export class BlockCandidateUseCase{
    private readonly candidateRepo : CandidateRepository;

    constructor(
        candidateRepo : CandidateRepository
    ){
        this.candidateRepo = candidateRepo;
    }

    async execute(candidateId : string):Promise<void>{

        if(typeof candidateId !== "string"){
            throw new Error('Invalid candidateid  : must be string')
        }
        return this.candidateRepo.blockCandidate(candidateId)
    }
}