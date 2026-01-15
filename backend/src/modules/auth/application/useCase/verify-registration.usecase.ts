import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { TokenServicePort } from "../ports/token.service.ports";

interface VerificationInput {
  email: string;
  otp: string;
  password: string;
  fullName: string;
  role: "candidate" | "recruiter";
}

export class VerifyRegistrationUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpService: {
      verify(email: string, otp: string, role: string): Promise<void>;
    },
    private readonly passwordService: {
      hash(password: string): Promise<string>;
    },
    private readonly tokenService: TokenServicePort,
    private readonly profileService: {
      createProfile(userId: string, role: string): Promise<void>;
    }
  ) {}

  async execute(input: VerificationInput) {
    await this.otpService.verify(input.email, input.otp, input.role);

    const passwordHash = await this.passwordService.hash(input.password);

    const user = new User("", input.email, input.role, input.fullName, true, "local");

    const savedUser = await this.userRepo.create(user, passwordHash);

    await this.profileService.createProfile(savedUser.id, savedUser.role);

    return this.tokenService.generateToken(savedUser);
  }
}
