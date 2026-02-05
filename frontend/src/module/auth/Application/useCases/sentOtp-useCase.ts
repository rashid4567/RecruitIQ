
import type { UserRole } from "../../domain/constants/user-role";
import type { AuthRepository } from "../../domain/repository/AuthRepository";
import { Email } from "../../domain/value-object/email.vo";


export class SendOTPUseCase{
    private readonly authRepo : AuthRepository;
    constructor(
        authRepo : AuthRepository
    ){
        this.authRepo = authRepo
    }

    async execute(rawemail : string, role : UserRole){
        const email = Email.create(rawemail)
        if(!email){
            throw new Error("Email is required")
        }

        return this.authRepo.sendOtp(email, role)
    }
    
}