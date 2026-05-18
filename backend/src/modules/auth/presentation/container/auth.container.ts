import { GoogleAuthPort } from "../../application/ports/google-auth.ports";
import { PasswordHasherPort } from "../../domain/ports/password-hasher.port";
import { AuthTokenServicePort } from "../../application/ports/token.service.ports";

import { AdminLoginUseCase } from "../../application/useCase/auth/admin-login.usecase";
import { GoogleLoginUseCase } from "../../application/useCase/google/google-login.usecase";
import { LoginUseCase } from "../../application/useCase/auth/login.useCase";
import { RefreshTokenUseCase } from "../../application/useCase/token/refreshToken.useCase";
import { SendRegistrationOTPUseCase } from "../../application/useCase/registration/send-registration-otp.usecase";
import { VerifyRegistrationUseCase } from "../../application/useCase/registration/verify-registration.usecase";
import { ForgotPasswordUseCase } from "../../application/useCase/password/forgot-password.usecase";
import { ResetPasswordUseCase } from "../../application/useCase/password/reset-password.usecase";
import { UpdatePasswordUseCase } from "../../application/useCase/password/update-password.usecase";
import { ActivityTrackerService } from "../../../../shared/ActivityLogger/service/activityTracker.service";

import { UserRepository } from "../../domain/repositories/user.repository";
import { MongooseUserRepository } from "../../infrastructure/repositories/mongoose-user.repository";

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
import { VerifyEmailUpdateUseCase } from "../../application/useCase/email/verify-email-update.usecase";
import { RequestEmailUpdateUseCase } from "../../application/useCase/email/request-email.update.usecase";
import { EmailUpdateController } from "../controller/email-update.controller";

const userRepo: UserRepository = new MongooseUserRepository();
const passwordPort: PasswordHasherPort = new PasswordService();
const tokenService: AuthTokenServicePort = new TokenService();
const googleAuthService: GoogleAuthPort = new GoogleService();

const otpService = new OTPService();
const emailService = new EmailService();
const activityTracker = new ActivityTrackerService();

const sendOtpUC = new SendRegistrationOTPUseCase(userRepo, otpService);

const verifyRegistrationUC = new VerifyRegistrationUseCase(
  userRepo,
  otpService,
  passwordPort,
  tokenService,
  activityTracker,
  sendEmailByEventUC,
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

const requestEmailUpdateUc = new RequestEmailUpdateUseCase(
  userRepo,
  otpService,
);
const verifyEmailUpdateUc = new VerifyEmailUpdateUseCase(otpService, userRepo);

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
export const emailUpdateController = new EmailUpdateController(
  requestEmailUpdateUc,
  verifyEmailUpdateUc,
);
