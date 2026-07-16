import { UserRepository } from "../../../domain/repositories/user.repository";
import { Email } from "../../../domain/value.objects/email.vo";
import { GoogleId } from "../../../domain/value.objects/google-id.vo";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { GoogleAuthPort } from "../../ports/google-auth.ports";
import { USER_ROLES } from "../../../domain/constants/roles.constants";
import { User } from "../../../domain/entities/user.entity";
import { AuthResult } from "../../types/auth-result.type";
import { AuthTokenServicePort } from "../../ports/token.service.ports";
import { GoogleLoginRequestDTO } from "../../dto/google-login.dto";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { CandidateRepository } from "../../../../candidate/domain/repositories/candidate.repository";
import { RecruiterProfileRepository } from "../../../../recruiter/domain/repositories/recruiter.repository";
import { UserId } from "../../../../../shared/value-objects/userId.vo";

export class GoogleLoginUseCase implements IUseCase<
  GoogleLoginRequestDTO,
  AuthResult
> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly candidateProfileRepo: CandidateRepository,
    private readonly recruiterProfileRepo: RecruiterProfileRepository,
    private readonly googleAuth: GoogleAuthPort,
    private readonly tokenService: AuthTokenServicePort,
  ) {}

  async execute(request: GoogleLoginRequestDTO): Promise<AuthResult> {
    const googleUser = await this.googleAuth.verifyToken(request.credential);
    const email = Email.create(googleUser.email);
    const googleId = GoogleId.create(googleUser.googleId);
    let user = await this.userRepo.findByEmail(email);
    if (
      (user && user.role === USER_ROLES.ADMIN) ||
      request.role === USER_ROLES.ADMIN
    ) {
      throw new ApplicationError(
        ERROR_CODES.GOOGLE_LOGIN_NOT_ALLOWED_FOR_ADMIN,
      );
    }
    if (user && user.authProvider.isLocal()) {
      throw new ApplicationError(ERROR_CODES.EMAIL_ALREADY_EXISTS);
    }
    if (user && request.role && user.role !== request.role) {
      throw new ApplicationError(ERROR_CODES.ROLE_MISMATCH);
    }
    if (user && !user.canLogin()) {
      throw new ApplicationError(ERROR_CODES.ACCOUNT_DEACTIVATED);
    }

    const isFirstLogin = !user;
    if (!user) {
      if (!request.role) {
        throw new ApplicationError(ERROR_CODES.ROLE_REQUIRED);
      }
      user = User.registerWithGoogle({
        email,
        role: request.role,
        fullName: googleUser.fullName,
        googleId,
      });
      user = await this.userRepo.save(user);
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
      isFirstLogin,
      profileCompleted,
    };
  }
}
