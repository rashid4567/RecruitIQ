import type { CandidateRepository } from "../../../domain/repositories/candidate.repository";

export class GetCandidateProfileUseCase{
    private readonly candidateRepo : CandidateRepository;
    constructor(
        candidateRepo : CandidateRepository
    ){
        this.candidateRepo = candidateRepo
    }

    async execute(userId : string){
        return this.candidateRepo.getProfile(userId)
    }
}