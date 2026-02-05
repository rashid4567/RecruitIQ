import type { AuthRepository } from "../../domain/repository/AuthRepository";
import { Email } from "../../domain/value-object/email.vo";

export class ForgotPasswordUseCase{
    private readonly authRepo : AuthRepository
    constructor(
        authRepo : AuthRepository
    ){
        this.authRepo = authRepo;
    }

    async execute(rawemail : string):Promise<void>{
        const email = Email.create(rawemail)
        if(!email){
            throw new Error("Email is requred")
        }
        return this.authRepo.forgotPassword(email)
    }
}