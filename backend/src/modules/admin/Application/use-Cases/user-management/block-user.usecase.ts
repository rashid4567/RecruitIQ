import { UserId } from "../../../../../shared/domain/value-objects.ts/userId.vo";
import { ApplicationError } from "../../../../auth/application/errors/application.error";
import { UserRepository } from "../../../Domain/repositories/user.repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";


export class BlockUserUseCase{
    constructor(
        private readonly userRepo : UserRepository,
    ){};
    async execute(userId : string):Promise<void>{
        const id =  UserId.create(userId)
        const user = await this.userRepo.findById(id);

        if(!user){
            throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND)
        }

        user.block()
        await this.userRepo.save(user);

        
    }
}