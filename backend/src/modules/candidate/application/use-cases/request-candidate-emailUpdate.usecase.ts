// import { OTPServicePort } from "../ports/otp.service.port"; 
// import { UserRepository } from "../../domain/repositories/user.repository";
// import { Email } from "../../domain/value-objects/email.vo";
// import { UserId } from "../../domain/value-objects/user-id.vo";
// import { OTP_ROLES } from "../constants/otp.roles.constants";
// import { ApplicationError } from "../error/applicatoin.error";
// import { ERROR_CODES } from "../constants/error-code.constant";

// export class RequestCandidateEmailUpdateUseCase{
//     constructor(
//         private readonly userRepo : UserRepository,
//         private readonly otpService : OTPServicePort,
//     ){};
//     async execute(userId : string, newEmail : string){
//         const id = UserId.create(userId);
//         const email = Email.create(newEmail)
//         const user = await this.userRepo.findById(id);
//         if(!user){
//             throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND)
//         }
//         const existing = await this.userRepo.findByEmail(email);
        
//         if(!existing){
//             throw new ApplicationError(ERROR_CODES.EMAIL_ALREADY_EXISTS)
//         }

//         await this.otpService.create(email.getValue(), OTP_ROLES.CANDIDATE)
//     }
// }