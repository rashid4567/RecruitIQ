import { CandidateProfileDTO } from "../../../candidate/application/dto/candidate-profile.dto";
import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { RecruiterProfileDTO } from "../dto/recruiter-profile.dto";

export class CompleteRecruiterProfileUseCase{
    constructor(
        private readonly RecruiterRepo : RecruiterProfileRepository,
    ){};

    async execute(userId :string, data : Partial<RecruiterProfileDTO>){
        if(!data.companyName){
            throw new Error("Company name is required")
        }

         const profile = await this.RecruiterRepo.updateByUserId(userId, data);
         if(!profile)throw new Error("Recruiter profile not found");

         return profile;
    }
   
}