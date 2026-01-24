import { email } from "zod";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Email } from "../../domain/value.objects.ts/email.vo";
import { Password } from "../../domain/value.objects.ts/password.vo";
import { VerificationInput } from "../dto/verification.input.dto";
import { OTPServicePort } from "../ports/otp.service.ports";
import { PasswordHasherPort } from "../ports/password.service.port";
import { SUCCESS_CODES } from "../constants/success-code.contents";

export class VerifyRegistrationUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpRepo: OTPServicePort,
    private readonly passwrodHash: PasswordHasherPort,
  ) {}

  async execute(input: VerificationInput) {
    await this.otpRepo.verify(Email.create(input.otp), input.otp, input.role);
    const password = Password.create(input.password);
    const passwordHash = await this.passwrodHash.hash(password);

    const user = User.register({
      id: "",
      email: Email.create(input.email),
      role: input.role,
      fullName: input.fullName,
      passwordHash,
    });

    const savedUser = await this.userRepo.save(user);

    return {
      code: SUCCESS_CODES.USER_CREATED,
      userId: savedUser.id,
    };
  }
}
