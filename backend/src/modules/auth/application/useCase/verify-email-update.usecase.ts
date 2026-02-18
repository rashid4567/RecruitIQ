import { OTPServicePort } from "../ports/otp.service.ports"; 
import { OtpRole } from "../../domain/constants/otp-roles.constants";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Email } from "../../../../shared/value-objects.ts/email.vo";

export class VerifyEmailUpdateUseCase {
  constructor(
    private readonly otpService: OTPServicePort,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(input: {
    userId: string;
    newEmail: string;
    otp: string;
    context: OtpRole;
  }): Promise<void> {
    const email = Email.create(input.newEmail);

    await this.otpService.verify(email, input.otp, input.context);

    const user = await this.userRepo.findById(input.userId);
    if (!user) throw new Error("User not found");

    const existing = await this.userRepo.findByEmail(email);
    if (existing && existing.id !== user.id) {
      throw new Error("Email already exists");
    }

    const updatedUser = user.updateEmail(email);
    await this.userRepo.save(updatedUser);
  }
}
