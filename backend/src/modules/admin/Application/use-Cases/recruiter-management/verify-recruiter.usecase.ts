import { ApplicationError } from "../../../../auth/application/errors/application.error";
import { RecruiterRepository } from "../../../Domain/repositories/recruiter.repository";
import { ERROR_CODES } from "../../constants/errorcode.constatns";

export class VerifyRecruiterUseCase{
    constructor(
        private readonly recruiterRepo : RecruiterRepository
    ){};

    async execute(recruiterId : string):Promise<void>{
        const recruiter = await this.recruiterRepo.findById(recruiterId);

        if(!recruiter){
            throw new ApplicationError(ERROR_CODES.RECRUITER_PROFILE_NOT_FOUND)
        }

        if(!recruiter.canBeRejected()){
            throw new ApplicationError(ERROR_CODES.RECRUITER_CANNOT_BE_VERIFIED)
        }

        const updated = recruiter.reject();

        await this.recruiterRepo.verifyRecruiter(
            updated.getId(),
            "verified"
        )
    }
}