import { GoogleAuthPort } from "./application/ports/google-auth.ports";
import { PasswordHasherPort } from "./application/ports/password.service.port";
import { AuthTokenServicePort } from "./application/ports/token.service.ports";
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
import { GoogleController } from "./presentation/controller/google.controller";
import { EmailService } from "./infrastructure/service/email.service";
import { OtpController } from "./presentation/controller/otp.controller";
import { RegistrationController } from "./presentation/controller/registration.controller";
import { AdminAuthController } from "./presentation/controller/admin.auth.controller";
import { TokenController } from "./presentation/controller/token.controller";
import { PasswordController } from "./presentation/controller/password.controller";

const userRepo: UserRepository = new MongooseUserRepository();
const passwordPort: PasswordHasherPort = new PasswordService();
const tokenService: AuthTokenServicePort = new TokenService();
const googleAuthService: GoogleAuthPort = new GoogleService();
const profileService = new ProfileService();

const otpService = new OTPService();
const emailService = new EmailService();
const sendOtpUC = new SendRegistrationOTPUseCase(userRepo, otpService);

const verifyRegistrationUC = new VerifyRegistrationUseCase(
  userRepo,
  otpService,
  passwordPort,
  tokenService,
);

const loginUC = new LoginUseCase(userRepo, passwordPort, tokenService);

const adminLoginUC = new AdminLoginUseCase(loginUC);

const refreshTokenUC = new RefreshTokenUseCase(userRepo, tokenService);
const forgotPassWordUC = new ForgotPasswordUseCase(
  userRepo,
  tokenService,
  emailService,
);
const resetPasswordUC = new ResetPasswordUseCase(
  userRepo,
  passwordPort,
  tokenService,
);
const googleLoginUc = new GoogleLoginUseCase(
  userRepo,
  googleAuthService,
  tokenService,
);
export const authController = new AuthController(loginUC);
export const otpController = new OtpController(sendOtpUC);
export const registrationController = new RegistrationController(
  verifyRegistrationUC,
);
export const adminAuthcontroller = new AdminAuthController(adminLoginUC);
export const tokenController = new TokenController(refreshTokenUC);
export const passwordController = new PasswordController(
  forgotPassWordUC,
  resetPasswordUC,
);

export const googleController = new GoogleController(googleLoginUc);
