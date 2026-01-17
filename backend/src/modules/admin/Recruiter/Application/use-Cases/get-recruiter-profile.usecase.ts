import { Types } from "mongoose";
import { RecruiterRepository } from "../../Domain/repositories/recruiter.repository";

export class GetRecruiterProfileUseCase{
    constructor(
        private recruiterRepo : RecruiterRepository,
    ){};

    async execute(userId : string){
       if(!Types.ObjectId.isValid(userId)){
        throw new Error("Invalid recruiter id")
       }

       const profile = await this.recruiterRepo.getRecruiterProfile(userId);
       if(!profile)throw new Error("Recruiter profile not found")
        return profile;
    }
}