import { UserRepository } from "../../domain/repositories/user.repository";
import { OTPServicePort } from "../ports/opt.service.ports";

export class SendRegistrationOTPUseCase {
  constructor(
    private readonly userRepo : UserRepository,
    private readonly otpService : OTPServicePort,
  ){};
  async execute(email :string, role : "candidate" | "recruiter") :Promise<void>{
    if(!["candidate","recruiter"].includes(role)){
      throw new Error("Invalid role")
    }

    const exsting = await this.userRepo.findByEmail(email);
    if(exsting){
      throw new Error("User already exists")
    }
    await this.otpService.create(email, role)
  }
}