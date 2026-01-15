import { UserRepository } from "../../domain/repositories/user.repository"
import { passwordServicePort } from "../ports/password.service.port";
import { TokenServicePort } from "../ports/token.service.ports";
import { User } from "../../domain/entities/user.entity";

export class LoginUseCase{
    constructor(
        private readonly userRepo : UserRepository,
        private readonly passwordService : passwordServicePort,
        private readonly tokenService : TokenServicePort,
    ){};

    async execute(email :string, password :string):Promise<{
        user : User,
        accessToken : string,
        refreshToken : string,
    }>{
        const user = await this.userRepo.findByEmail(email);
        if(!user)throw new Error("Invalid email or password");
        if(!user.isActive)throw new Error("Account is deactivated please contact admin");
        const passwordHash = await this.userRepo.getPasswordHash(email);
        if(!passwordHash)throw new Error("please login with the socail account");

        const isMatch = await this.passwordService.compare(password, passwordHash);
        if(!isMatch)throw new Error("invalid email or password");

        const tokens = this.tokenService.generateToken(user)
        return {
            user,
            ...tokens
        }
    }
}