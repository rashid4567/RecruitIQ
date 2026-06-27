import { USER_ROLES } from "../../domain/constants/roles.constants";
import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants"; 
import { ApplicationError } from "../../../../shared/errors/application.error";
import { ProfileCreatorPort } from "../ports/profile-creator.port";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { CreateProfileRequest } from "../dto/create.profileDTO";

export class CreateProfileUseCase implements IUseCase<CreateProfileRequest,void>{
    constructor(private readonly ProfileCreator : ProfileCreatorPort){};

    async execute(request : CreateProfileRequest):Promise<void>{
        if(request.role === USER_ROLES.CANDIDATE){
            await this.ProfileCreator.createCandidateProfile(request.userId);
            return;
        }
 
        if(request.role === USER_ROLES.RECRUTER){
            await this.ProfileCreator.createRecruiterProfile(request.userId);
            return
        }
        throw new ApplicationError(ERROR_CODES.UNSUPPORTED_ROLE)
    }
}