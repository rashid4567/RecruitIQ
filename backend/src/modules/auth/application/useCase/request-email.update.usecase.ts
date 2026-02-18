import { OTPServicePort } from "../ports/otp.service.ports";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Email } from "../../../../shared/value-objects.ts/email.vo";
import { OTP_ROLES } from "../../domain/constants/otp-roles.constants";


export class RequestEmailUpdateUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpService: OTPServicePort,
  ) {}

  async execute(userId: string, newEmail: string): Promise<void> {
    const email = Email.create(newEmail);

    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.email.equals(email)) {
      throw new Error("Email already current");
    }

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) throw new Error("Email already exists");

    await this.otpService.create(email, OTP_ROLES.CANDIDATE);
  }
}
