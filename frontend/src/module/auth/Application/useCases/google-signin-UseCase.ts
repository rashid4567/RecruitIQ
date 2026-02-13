import type { GoogleRoles } from "../../domain/constants/google-role";
import type { AuthRepository } from "../../domain/repository/AuthRepository";

export class GoogleAuthUseCase{
    private readonly AuthRepo : AuthRepository;
    constructor(
        AuthRepo : AuthRepository
    ){
        this.AuthRepo = AuthRepo
    }

    async execute(credential : string, role ?:GoogleRoles){
        if(!credential){
            throw new Error("Google credential is missing")
        }

        return this.AuthRepo.googleLogin(credential, role)
    }
}