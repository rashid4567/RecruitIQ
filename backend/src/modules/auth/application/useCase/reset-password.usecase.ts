import { UserRepository } from "../../domain/repositories/user.repository";
import { PasswordService } from "../../infrastructure/service/password.service";
import { TokenServicePort } from "../ports/token.service.ports";

export class ResetPasswordUseCase{
    constructor(
        private readonly userRepo : UserRepository,
        private readonly passwordService : PasswordService,
        private readonly tokenService : TokenServicePort,
    ){};

    async execute(token : string, newPassWord :string):Promise<void>{
       const {userId} = this.tokenService.verifyPasswordResetToken(token);
       const hashed = await this.passwordService.hash(newPassWord);
       await this.userRepo.updatePassword(userId, hashed)
    }
}