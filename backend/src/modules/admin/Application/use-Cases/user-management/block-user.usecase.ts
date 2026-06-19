import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { ApplicationError } from "../../../../../shared/errors/application.error"; 
import { UserRepository } from "../../../Domain/repositories/user.repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UserStatusRequestDTO } from "../../dto/recruiter.dto/user.status.dto";


export class BlockUserUseCase implements UseCase<UserStatusRequestDTO,void>{
    constructor(
        private readonly userRepo : UserRepository,
    ){};
    async execute(request : UserStatusRequestDTO):Promise<void>{
        const id =  UserId.create(request.userId)
        const user = await this.userRepo.findById(id);

        if(!user){
            throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND)
        }

        user.block()
        await this.userRepo.save(user);

        
    }
}