import { OTPServicePort } from "../../../auth/application/ports/otp.service.ports";
import { UserRepository } from "../../domain/repositories/user.repository";

export class verifyCadndidateEmailUpdateUseCase{
    constructor(
        private readonly otpService : OTPServicePort,
        private readonly userRepo : UserRepository,
    ){};

    async execute(input : {
        userId :string,
        newEmail : string,
        otp : string,
    }){
        await this.otpService.verify(input.newEmail, input.otp, "candidate");
        await this.userRepo.updateProfile(input.userId,{
            email : input.newEmail
        })
    };
}