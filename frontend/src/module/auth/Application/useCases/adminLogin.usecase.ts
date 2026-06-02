import { AuthUser } from "../../domain/entities/AuthUser";
import type { AuthRepository } from "../../domain/repository/AuthRepository";
import { Email } from "../../domain/value-object/email.vo";
import { Password } from "../../domain/value-object/password.vo";

export class AdminLoginUseCase{
    private readonly authRepo : AuthRepository
    constructor( authRepo : AuthRepository){
        this.authRepo = authRepo;
    }

    async execute(email : string, password : string):Promise<{accessToken : string, user : AuthUser}>{
       const emailVO = new Email(email);
    const passwordVO = new Password(password);
    if(!emailVO || !passwordVO){
        throw new Error("Email and password are required");
    }
        return await this.authRepo.adminLogin(emailVO, passwordVO)
    }
}