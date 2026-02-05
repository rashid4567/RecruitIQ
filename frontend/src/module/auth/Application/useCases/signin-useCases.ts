import type { AuthRepository } from "../../domain/repository/AuthRepository";
import { Email } from "../../domain/value-object/email.vo";
import { Password } from "../../domain/value-object/password.vo";

export class SignInUseCase{
    private readonly authRepo : AuthRepository
    constructor(
        authRepo : AuthRepository
    ){
        this.authRepo = authRepo
    }

    async execute(rawemail : string, rawpassword : string){
        const email = Email.create(rawemail);
        const password = Password.create(rawpassword)
        if(!email || !password){
            throw new Error("Email and password are required")
        }

        return this.authRepo.login(email, password)
    }
}