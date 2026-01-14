import { UserRepository } from "../../domain/repositories/user.repository"

export class LoginUseCase{
    constructor(
        private readonly userRepo : UserRepository,
        private readonly passwordService : any,
        private readonly tokenService : any,
    ){};

    async execute(email :string, password :string){
        const user = await this.userRepo.findByEmail(email);
        if(!user)throw new Error("Invalid email or password");
        if(!user.isActive)throw new Error("Account is deactivated please contact admin");
        const hash = await this.userRepo.getPasswordHash(email);
        if(!hash)throw new Error("please login with the socail account");

        const isValid = await this.passwordService.compare(password, hash);
        if(!isValid)throw new Error("invalid email or password")
        
        return this.tokenService.generateToken(user)
    }
}