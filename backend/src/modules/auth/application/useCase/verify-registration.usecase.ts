import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Email } from "../../../../shared/domain/value-objects.ts/email.vo";
import { Password } from "../../../../shared/domain/value-objects.ts/password.vo";
import { VerificationInput } from "../dto/verification.input.dto";
import { OTPServicePort } from "../ports/otp.service.ports";
import { PasswordHasherPort } from "../../domain/ports/password-hasher.port";
import { AuthTokenServicePort } from "../ports/token.service.ports";
import { SUCCESS_CODES } from "../constants/success-code.contents";
import { ApplicationError } from "../errors/application.error";
import { ERROR_CODES } from "../constants/error-codes.constants";

export class VerifyRegistrationUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpRepo: OTPServicePort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenService: AuthTokenServicePort,
  ) {}

  async execute(input: VerificationInput) {
    const email = Email.create(input.email);

    await this.otpRepo.verify(email, input.otp, input.role);

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new ApplicationError(ERROR_CODES.USER_ALREADY_EXISTS);
    }

    const password = Password.create(input.password);
    const passwordHash = await this.passwordHasher.hash(password);

    const user = User.register({
      email,
      role: input.role,
      fullName: input.fullName,
      passwordHash,
    });

    const savedUser = await this.userRepo.save(user);

    return {
  accessToken: this.tokenService.generateAccessToken(
    savedUser.id!,
    savedUser.role,
  ),
  refreshToken: this.tokenService.generateRefreshToken(savedUser.id!),
  user: {
    id: savedUser.id!,
    role: savedUser.role,
    fullName: savedUser.fullName,
  },
};

  }
}
