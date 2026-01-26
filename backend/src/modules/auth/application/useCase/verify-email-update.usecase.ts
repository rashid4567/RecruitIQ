import { OTPServicePort } from "../ports/otp.service.ports"; 
import { OtpRole } from "../../domain/constants/otp-roles.constants";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Email } from "../../domain/value.objects.ts/email.vo";

export class verifyEmailUpdateUseCase{
    constructor(
        private readonly otpService : OTPServicePort,
        private readonly userRepo : UserRepository,
    ){};

    async execute(input : {
        userId :string,
        newEmail : Email,
        otp : string,
        context : OtpRole
    }):Promise<void>{
      
        await this.otpService.verify(
            input.newEmail,
            input.otp,
            input.context,
        )
      
        const user = await this.userRepo.findById(input.userId);

        if(!user){
            throw new Error("User not found")
        }

        const updateUser = user.updateEmail(input.newEmail);

        await this.userRepo.save(updateUser);
    };
}