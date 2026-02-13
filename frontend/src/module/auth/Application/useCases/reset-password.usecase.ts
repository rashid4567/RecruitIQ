import type { AuthRepository } from "../../domain/repository/AuthRepository";
import { Password } from "../../domain/value-object/password.vo";

export class ResetPasswordUseCase{
    private readonly authRepo : AuthRepository;
    constructor(
        authRepo : AuthRepository
    ){
        this.authRepo = authRepo
    }

    async execute(token : string, rawnewPassword : string){
        const newPassword = Password.create(rawnewPassword)
        if(!token){
            throw new Error("Reset token is missing")
        }

        if(!newPassword){
            throw new Error("New password is missing")
        }

        await this.authRepo.resetPassword(token, newPassword)
    }
}