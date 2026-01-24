import { GoogleAuthPort } from "./application/ports/google-auth.ports";
import { passwordServicePort } from "./application/ports/password.service.port";
import { TokenServicePort } from "./application/ports/token.service.ports";
import { AdminLoginUseCase } from "./application/useCase/admin-login.usecase";
import { GoogleLoginUseCase } from "./application/useCase/google-login.usecase";
import { LoginUseCase } from "./application/useCase/login.useCase";
import { RefreshTokenUseCase } from "./application/useCase/refreshToken.useCase";
import { SendRegistrationOTPUseCase } from "./application/useCase/send-registration-otp.usecase";
import { VerifyRegistrationUseCase } from "./application/useCase/verify-registration.usecase";
import { ForgotPasswordUseCase } from "./application/useCase/forgot-password.usecase";
import { ResetPasswordUseCase } from "./application/useCase/reset-password.usecase";
import { UserRepository } from "./domain/repositories/user.repository";
import { MongooseUserRepository } from "./infrastructure/repositories/mongoose-use.repository";
import { GoogleService } from "./infrastructure/service/google-auth.service";
import { OTPService } from "./infrastructure/service/otp.service";

import { PasswordService } from "./infrastructure/service/password.service";
import { ProfileService } from "./infrastructure/service/profile.service";
import { TokenService } from "./infrastructure/service/token.service";

import { AuthController } from "./presentation/controller/auth.controller";
import { GoogleController } from "./presentation/google.controller";

const userRepo: UserRepository = new MongooseUserRepository();
const passwordService: passwordServicePort = new PasswordService();
const tokenService: TokenServicePort = new TokenService();
const googleAuthService: GoogleAuthPort = new GoogleService();
const profileService = new ProfileService();

const otpService = new OTPService();

const sendOtpUC = new SendRegistrationOTPUseCase(userRepo, otpService);

const verifyRegistrationUC = new VerifyRegistrationUseCase(
  userRepo,
  otpService,
  passwordService,
  tokenService,
  profileService
);

const loginUC = new LoginUseCase(userRepo, passwordService, tokenService);

const adminLoginUC = new AdminLoginUseCase(loginUC);

const refreshTokenUC = new RefreshTokenUseCase(userRepo, tokenService);
const forgotPassWordUC = new ForgotPasswordUseCase(userRepo, tokenService);
const resetPasswordUC  = new ResetPasswordUseCase(
  userRepo,
  passwordService,
  tokenService,
);
const googleLoginUc = new GoogleLoginUseCase(
  userRepo,
  googleAuthService,
  tokenService,
  profileService
);
export const authController = new AuthController(
  sendOtpUC,
  verifyRegistrationUC,
  loginUC,
  adminLoginUC,
  refreshTokenUC,
  forgotPassWordUC,
  resetPasswordUC
);

export const googleController = new GoogleController(googleLoginUc);
