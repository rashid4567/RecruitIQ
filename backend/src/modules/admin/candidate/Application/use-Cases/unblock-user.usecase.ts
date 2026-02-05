import { UserId } from "../../../../../shared/domain/value-objects.ts/userId.vo";
import { ApplicationError } from "../../../../../shared/errors/applicatoin.error";
import { UserRepository } from "../../Domain/repositories/user.repository";
import { ERROR_CODES } from "../constants/errorcode.constatns";

export class UnblockUserUseCase{
    constructor(
        private readonly userRepo : UserRepository
    ){};

    async execute(userId : string){{
        const id = UserId.create(userId);
        const user = await this.userRepo.findById(id);

        if(!user){
            throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND)
        }

        user.unblock();
        await this.userRepo.save(user);
    }}

    
}