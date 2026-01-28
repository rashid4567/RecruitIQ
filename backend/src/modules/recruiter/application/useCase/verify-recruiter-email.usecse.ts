// import { UserServicePort } from "../../application/ports/user.service.port";
// import { OTPServicePort } from "../../../auth/application/ports/otp.service.ports";

// export class VerifyRecruiterEmailUpdateUseCase {
//   constructor(
//     private readonly userService: UserServicePort,
//     private readonly otpService: OTPServicePort
//   ) {}

//   async execute(input: {
//     userId: string;
//     newEmail: string;
//     otp: string;
//   }): Promise<void> {
//     const normalizedEmail = input.newEmail.toLowerCase().trim();

//     await this.otpService.verify(normalizedEmail, input.otp, "recruiter");

 
//     await this.userService.updateEmail(input.userId, normalizedEmail);
//   }
// }
