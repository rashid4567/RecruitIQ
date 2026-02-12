import type { RecruiterRepository } from "../../domain/repositories/recruiter.repository";
import type { GetRecruitersQuery } from "../dto/get-recruiters.query";

export class GetRecruiterListUseCase{
    private readonly recruiterRepo : RecruiterRepository;
    constructor(
        recruiterRepo : RecruiterRepository
    ){
        this.recruiterRepo = recruiterRepo
    }

    async execute(query :  GetRecruitersQuery){
        return this.recruiterRepo.getRecruiters(query)
    }
}