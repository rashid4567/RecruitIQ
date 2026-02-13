import { USER_ROLES, userRoles } from "../../domain/constants/roles.constants";
import { ERROR_CODES } from "../constants/error-codes.constants";
import { ApplicationError } from "../errors/application.error";
import { ProfileCreatorPort } from "../ports/profile-creator.port";

export class CreateProfileUseCase{
    constructor(private readonly ProfileCreator : ProfileCreatorPort){};

    async execute(userId : string, role : userRoles):Promise<void>{
        if(role === USER_ROLES.CANDIDATE){
            await this.ProfileCreator.createCandidateProfile(userId);
            return;
        }

        if(role === USER_ROLES.RECRUTER){
            await this.ProfileCreator.createRecruiterProfile(userId);
            return
        }
        throw new ApplicationError(ERROR_CODES.UNSUPPORTED_ROLE)
    }
}