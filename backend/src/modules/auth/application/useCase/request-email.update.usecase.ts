import { OTPServicePort } from "../ports/otp.service.ports";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Email } from "../../../../shared/domain/value-objects.ts/email.vo";
import { OTP_ROLES } from "../../domain/constants/otp-roles.constants";


export class RequestEmailUpdateUseCase{
    constructor(
        private readonly userRepo : UserRepository,
        private readonly otpService : OTPServicePort,
    ){};
    async execute(userId : string, newEmail : string){
        
        const email = Email.create(newEmail)
        const user = await this.userRepo.findById(userId);
        if(!user){
            throw new Error("User not found")
        }
        const existing = await this.userRepo.findByEmail(email);
        
        if(existing){
            throw new Error("Email already exists")
        }

        await this.otpService.create(email,OTP_ROLES.CANDIDATE)
    }
}