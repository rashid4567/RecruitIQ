import type { UserRole } from "../../domain/constants/user-role";
import type { AuthRepository } from "../../domain/repository/AuthRepository";
import { Email } from "../../domain/value-object/email.vo";
import { Password } from "../../domain/value-object/password.vo";

export class VerifyOtpUseCase {
  private readonly authRepo: AuthRepository;
  constructor(authRepo: AuthRepository) {
    this.authRepo = authRepo;
  }

  async execute(payload: {
    rawEmail: string;
    rawPassword: string;
    otp: string;
    fullName: string;
    role: UserRole;
  }) {
    if (!payload.otp.trim()) {
      throw new Error("OTP is required");
    }

    if (!payload.fullName.trim()) {
      throw new Error("Full name is required");
    }

    const email = Email.create(payload.rawEmail);
    const password = Password.create(payload.rawPassword);

    return this.authRepo.verifyOtpAndRegister({
      email,
      password,
      otp: payload.otp,
      fullName: payload.fullName.trim(),
      role: payload.role,
    });
  }
}
