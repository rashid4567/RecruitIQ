import { UserId } from "../../../../../shared/domain/value-objects.ts/userId.vo";
import { ApplicationError } from "../../../../auth/application/errors/application.error";
import { RecruiterRepository } from "../../Domain/repositories/recruiter.repository";
import { ERROR_CODES } from "../constants/errorcode.constatns";

export class GetRecruiterProfileUseCase{
    constructor(
        private readonly recruiterRepo : RecruiterRepository
    ){};

    async execute(recruiterId : string){
        
        const recruiter = await this.recruiterRepo.findById(recruiterId);

        if(!recruiter){
            throw new ApplicationError(ERROR_CODES.RECRUITER_PROFILE_NOT_FOUND)
        }

        return recruiter
    }
}