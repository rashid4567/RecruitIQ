import type { RecruiterRepository } from "../../domain/repositories/recruiter.repository";

export class RejectRecruiterUseCase{
    private readonly recruiterRepo : RecruiterRepository;
    constructor(
        recruiterRepo : RecruiterRepository
    ){
        this.recruiterRepo = recruiterRepo
    }

    async execute(recruiterId : string){
        await this.recruiterRepo.updateVerificationStatus(
            recruiterId,
            "rejected"
        )
    }
}