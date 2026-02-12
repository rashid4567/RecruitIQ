import { GoogleAuthPort } from "../../application/ports/google-auth.ports";
import { PasswordHasherPort } from "../../domain/ports/password-hasher.port";
import { AuthTokenServicePort } from "../../application/ports/token.service.ports";

import { AdminLoginUseCase } from "../../application/useCase/admin-login.usecase";
import { GoogleLoginUseCase } from "../../application/useCase/google-login.usecase";
import { LoginUseCase } from "../../application/useCase/login.useCase";
import { RefreshTokenUseCase } from "../../application/useCase/refreshToken.useCase";
import { SendRegistrationOTPUseCase } from "../../application/useCase/send-registration-otp.usecase";
import { VerifyRegistrationUseCase } from "../../application/useCase/verify-registration.usecase";
import { ForgotPasswordUseCase } from "../../application/useCase/forgot-password.usecase";
import { ResetPasswordUseCase } from "../../application/useCase/reset-password.usecase";
import { UpdatePasswordUseCase } from "../../application/useCase/update-password.usecase";

import { UserRepository } from "../../domain/repositories/user.repository";
import { MongooseUserRepository } from "../../infrastructure/repositories/mongoose-use.repository";

import { GoogleService } from "../../infrastructure/service/google-auth.service";
import { OTPService } from "../../infrastructure/service/otp.service";
import { PasswordService } from "../../infrastructure/service/password.service";
import { TokenService } from "../../infrastructure/service/token.service";
import { EmailService } from "../../infrastructure/service/email.service";

import { AuthController } from "../controller/auth.controller";
import { GoogleController } from "../controller/google.controller";
import { OtpController } from "../controller/otp.controller";
import { RegistrationController } from "../controller/registration.controller";
import { AdminAuthController } from "../controller/admin.auth.controller";
import { TokenController } from "../controller/token.controller";
import { ForgotPasswordController } from "../controller/forgot-password.controller";
import { ChangePasswordController } from "../controller/updatePassword.controller";
import { sendEmailByEventUC } from "../../../admin/Presentation/containers/email-template.container";
import { EmailNotificationAdaptor } from "../../infrastructure/adapters/email-notification.adapter";

const userRepo: UserRepository = new MongooseUserRepository();
const passwordPort: PasswordHasherPort = new PasswordService();
const tokenService: AuthTokenServicePort = new TokenService();
const googleAuthService: GoogleAuthPort = new GoogleService();

const otpService = new OTPService();
const emailService = new EmailService();

const notificationService = new EmailNotificationAdaptor(sendEmailByEventUC);

const sendOtpUC = new SendRegistrationOTPUseCase(userRepo, otpService);

const verifyRegistrationUC = new VerifyRegistrationUseCase(
  userRepo,
  otpService,
  passwordPort,
  tokenService,
  notificationService,
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

const changePasswordUC = new UpdatePasswordUseCase(userRepo, passwordPort);

export const authController = new AuthController(loginUC);

export const otpController = new OtpController(sendOtpUC);

export const registrationController = new RegistrationController(
  verifyRegistrationUC,
);

export const adminAuthcontroller = new AdminAuthController(adminLoginUC);

export const tokenController = new TokenController(refreshTokenUC);

export const ForgotpasswordController = new ForgotPasswordController(
  forgotPassWordUC,
  resetPasswordUC,
);

export const changePassowrdController = new ChangePasswordController(
  changePasswordUC,
);

export const googleController = new GoogleController(googleLoginUc);
