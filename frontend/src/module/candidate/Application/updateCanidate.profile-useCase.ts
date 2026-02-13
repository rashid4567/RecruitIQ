import type { CandidateProfile } from "../domain/entities/candidateProfile";
import type { CandidateRepository } from "../domain/repositories/CandidateRepository";

export class UpdateCandidateProfile {
    private readonly candidateRepo : CandidateRepository;
    constructor(
        candidateRepo : CandidateRepository
    ){
        this.candidateRepo = candidateRepo;
    }

    async execute(profile : CandidateProfile){
        return this.candidateRepo.updateProfile(profile);
    }
}