import type { AuthRepository } from "../../domain/repository/AuthRepository";
import { Email } from "../../domain/value-object/email.vo";

export class VerifyEmailUpdateUseCase{
    private readonly authRepo  : AuthRepository;
    constructor(
        authRepo : AuthRepository
    ){
        this.authRepo = authRepo
    }

    async execute(input : {email : string, otp : string}){
        const email = Email.create(input.email);
        await this.authRepo.verifyEmailUpdate(email, input.otp)
    }
}