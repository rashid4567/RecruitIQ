import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";

export class GetRecruiterProfileUserCase{
    constructor(
        private readonly recruiterRepo : RecruiterProfileRepository
    ){};

    async execute(userId  :string){
        let profile = await this.recruiterRepo.findByUserId(userId);
        if(!profile) profile = await this.recruiterRepo.createIfNotExists(userId)
        return profile;
    }
}