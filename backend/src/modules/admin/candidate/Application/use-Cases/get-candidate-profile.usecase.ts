import { Types } from "mongoose";
import { CandidateRepository } from "../../Domain/repositories/candidate.repository";

export class GetCandidateprofileUseCase {
    constructor(
        private readonly candidateRepo : CandidateRepository
    ){};

    async execute(candidateId : string){
        if(!Types.ObjectId.isValid(candidateId)){
            throw new Error("Candidate id is not found")
        }
        const profile = await this.candidateRepo.getCandidateProfile(candidateId);
        if(!profile){
            throw new Error("Candidate profile is not found")
        }
        return profile;
    }
}