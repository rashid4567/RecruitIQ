import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { ApplicationError } from "../../../../../shared/errors/application.error"; 
import { UserRepository } from "../../../Domain/repositories/user.repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";

export class UnblockUserUseCase{
    constructor(
        private readonly userRepo : UserRepository
    ){};

    async execute(userId : string){
          if (!userId || userId === "[object Object]") {
    throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
  }
        const id = UserId.create(userId);
        const user = await this.userRepo.findById(id);

        if(!user){
            throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND)
        }

        user.unblock();
        await this.userRepo.save(user);
    }

    
}