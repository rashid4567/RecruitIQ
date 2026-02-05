
import { CandidateRepository } from "../../Domain/repositories/candidate.repository";
import { UserId } from "../../../../../shared/domain/value-objects.ts/userId.vo";

export class GetCandidateprofileUseCase {
    constructor(
        private readonly candidateRepo : CandidateRepository
    ){};

    async execute(candidateId : string){
      
       
        const profile = await this.candidateRepo.findById(candidateId);
        if(!profile){
            throw new Error("Candidate profile is not found")
        }
        return profile;
    }
}