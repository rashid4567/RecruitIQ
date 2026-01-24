import { OTPServicePort } from "../../../auth/application/ports/otp.service.ports";
import { UserRepository } from "../../domain/repositories/user.repository";

export class RequestCandidateEmailUpdateUseCase{
    constructor(
        private readonly userRepo : UserRepository,
        private readonly otpService : OTPServicePort,
    ){};
    async execute(userId : string, newEmail : string){
          const user = await this.userRepo.findById(userId);
        if(!user){
            throw new Error("User not found")
        }
        
        const existing = await this.userRepo.findByEmail(newEmail);
        if(existing){
            throw new Error("Email already in use")
        }
        await this.otpService.create(newEmail, "candidate");
    }
}