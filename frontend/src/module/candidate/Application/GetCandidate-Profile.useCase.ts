import type { CandidateRepository } from "../domain/repositories/CandidateRepository";


export class GetCandidateProfileUseCase{
    private readonly candidateRepo : CandidateRepository

    constructor(
        candidateRepo : CandidateRepository
    ){
        this.candidateRepo = candidateRepo
    }

    async execute(){
        return this.candidateRepo.getProfile();
    }
}