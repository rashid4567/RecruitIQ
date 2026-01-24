import { UserServicePort } from "../../application/ports/user.service.port";
import { OTPServicePort } from "../../../auth/application/ports/otp.service.ports";

export class RecruiterEmailUpdateUseCase {
  constructor(
    private readonly userService: UserServicePort,
    private readonly otpService: OTPServicePort
  ) {}

  async execute(userId: string, newEmail: string): Promise<void> {
    const normalizedEmail = newEmail.toLowerCase().trim();

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    

    await this.otpService.create(normalizedEmail, "recruiter");
  }
}
