import type { RecruiterRepository } from "../../domain/repositories/recruiter.repository";

export class GetRecruiterProfileUseCase{
    private readonly recruiterRepo : RecruiterRepository;
    constructor(
        recruiterRepo : RecruiterRepository
    ){
        this.recruiterRepo = recruiterRepo;
    }

    async execute(recruiterId : string){
        return this.recruiterRepo.getProfile(recruiterId)
    }
}