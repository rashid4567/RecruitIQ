import { UserRepository } from "../../../domain/repositories/user.repository";
import { PasswordHasherPort } from "../../../domain/ports/password-hasher.port";
import { Email } from "../../../domain/value.objects/email.vo";
import { Password } from "../../../domain/value.objects/password-hash.vo";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { AuthTokenServicePort } from "../../ports/token.service.ports";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { LoginRequestDTO, LoginResponseDTO } from "../../dto/login.dto";
import { CandidateRepository } from "../../../../candidate/domain/repositories/candidate.repository";
import { RecruiterProfileRepository } from "../../../../recruiter/domain/repositories/recruiter.repository";
import { USER_ROLES } from "../../../domain/constants/roles.constants";
import { UserId } from "../../../../../shared/value-objects/userId.vo";

export class LoginUseCase implements IUseCase<
  LoginRequestDTO,
  LoginResponseDTO
> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly candidateProfileRepo: CandidateRepository,
    private readonly recruiterProfileRepo: RecruiterProfileRepository,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenService: AuthTokenServicePort,
  ) {}

  async execute(input: LoginRequestDTO): Promise<LoginResponseDTO> {
    const email = Email.create(input.email);
    const password = Password.create(input.password);
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new ApplicationError(ERROR_CODES.INVALID_CREDENTIALS);
    }
    if (!user.canLogin()) {
      throw new ApplicationError(ERROR_CODES.ACCOUNT_DEACTIVATED);
    }
    if (!user.isLocalUser()) {
      throw new ApplicationError(ERROR_CODES.INVALID_CREDENTIALS);
    }
    if (input.requiredRole && user.role !== input.requiredRole) {
      throw new ApplicationError(ERROR_CODES.ROLE_MISMATCH);
    }

    const storedHash = user.getPasswordHash();
    if (!storedHash) {
      throw new ApplicationError(ERROR_CODES.PASSWORD_NOT_SET);
    }
    const authenticated = await this.passwordHasher.compare(
      password,
      storedHash,
    );
    if (!authenticated) {
      throw new ApplicationError(ERROR_CODES.INVALID_CREDENTIALS);
    }
    if (!user.id) {
      throw new ApplicationError(ERROR_CODES.USER_ID_NOT_FOUND);
    }

    let profileCompleted = false;
    if (user.role === USER_ROLES.CANDIDATE) {
      const candidateProfile = await this.candidateProfileRepo.findByUserId(
        UserId.create(user.id),
      );
      profileCompleted = candidateProfile?.isProfileCompleted() ?? false;
    }
    if (user.role === USER_ROLES.RECRUITER) {
      const recruiterProfile = await this.recruiterProfileRepo.findByUserId(
        UserId.create(user.id),
      );
      profileCompleted = recruiterProfile?.isProfileCompleted() ?? false;
    }

    return {
      accessToken: this.tokenService.generateAccessToken(user.id, user.role),
      refreshToken: this.tokenService.generateRefreshToken(user.id),
      user: {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        profileImage: user.profileImage,
      },
      profileCompleted,
      isFirstLogin: false,
    };
  }
}
