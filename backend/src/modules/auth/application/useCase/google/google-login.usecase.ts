import { UserRepository } from "../../../domain/repositories/user.repository";
import { Email } from "../../../domain/value.objects/email.vo";
import { GoogleId } from "../../../domain/value.objects/google-id.vo";
import { ERROR_CODES } from "../../constants/error-codes.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { GoogleAuthPort } from "../../ports/google-auth.ports";
import { USER_ROLES, userRoles } from "../../../domain/constants/roles.constants";
import { User } from "../../../domain/entities/user.entity";
import { AuthResult } from "../../types/auth-result.type";
import { AuthTokenServicePort } from "../../ports/token.service.ports";
import { GoogleLoginRequestDTO } from "../../dto/google-login.dto";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";

export class GoogleLoginUseCase implements UseCase<GoogleLoginRequestDTO, AuthResult> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly googleAuth: GoogleAuthPort,
    private readonly tokenServie: AuthTokenServicePort,
  ) {}

  async execute(Request : GoogleLoginRequestDTO): Promise<AuthResult> {
    const googleUser = await this.googleAuth.verifyToken(Request.credential);

    const email = Email.create(googleUser.email);
    const googleId = GoogleId.create(googleUser.googleId);

    let user = await this.userRepo.findByEmail(email);

    if ((user && user.role === USER_ROLES.ADMIN) || Request.role === USER_ROLES.ADMIN) {
      throw new ApplicationError(
        ERROR_CODES.GOOGLE_LOGIN_NOT_ALLOWED_FOR_ADMIN,
      );
    }

    if (user && user.authProvider.isLocal()) {
      throw new ApplicationError(ERROR_CODES.EMAIL_ALREADY_EXISTS);
    }

    if (user && Request.role && user.role !== Request.role) {
      throw new ApplicationError(ERROR_CODES.ROLE_MISMATCH);
    }

    if (user && !user.canLogin()) {
      throw new ApplicationError(ERROR_CODES.ACCOUNT_DEACTIVATED);
    }
 
    if (!user) {
      if (!Request.role) {
        throw new ApplicationError(ERROR_CODES.ROLE_REQUIRED);
      }

      user = User.registerWithGoogle({
        email,
        role : Request.role,
        fullName: googleUser.fullName,
        googleId,
      });

      user = await this.userRepo.save(user);
    }

    if (!user.id) {
      throw new ApplicationError(ERROR_CODES.USER_ID_NOT_FOUND);
    }

    return {
      accessToken: this.tokenServie.generateAccessToken(user.id, user.role),
      refreshToken: this.tokenServie.generateRefreshToken(user.id),
      userId: user.id,
      role: user.role,
      fullName: user.fullName,
    };
  }
}
