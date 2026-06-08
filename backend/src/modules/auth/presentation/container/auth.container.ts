import { GoogleAuthPort } from "../../application/ports/google-auth.ports";
import { AuthTokenServicePort } from "../../application/ports/token.service.ports";
import { PasswordHasherPort } from "../../domain/ports/password-hasher.port";
import { UserRepository } from "../../domain/repositories/user.repository";
import { AdminLoginUseCase } from "../../application/useCase/auth/admin-login.usecase";
import { LoginUseCase } from "../../application/useCase/auth/login.useCase";
import { SendRegistrationOTPUseCase } from "../../application/useCase/registration/send-registration-otp.usecase";
import { VerifyRegistrationUseCase } from "../../application/useCase/registration/verify-registration.usecase";
import { ForgotPasswordUseCase } from "../../application/useCase/password/forgot-password.usecase";
import { ResetPasswordUseCase } from "../../application/useCase/password/reset-password.usecase";
import { UpdatePasswordUseCase } from "../../application/useCase/password/update-password.usecase";
import { RefreshTokenUseCase } from "../../application/useCase/token/refreshToken.useCase";
import { GoogleLoginUseCase } from "../../application/useCase/google/google-login.usecase";
import { RequestEmailUpdateUseCase } from "../../application/useCase/email/request-email.update.usecase";
import { VerifyEmailUpdateUseCase } from "../../application/useCase/email/verify-email-update.usecase";
import { OtpEmailService } from "../../../email/application/services/otp-email.service";
import { PasswordResetEmailService } from "../../../email/application/services/password-reset-email.service";
import { MongooseUserRepository } from "../../infrastructure/repositories/mongoose-user.repository";
import { GoogleService } from "../../infrastructure/service/google-auth.service";
import { OTPService } from "../../infrastructure/service/otp.service";
import { PasswordService } from "../../infrastructure/service/password.service";
import { TokenService } from "../../infrastructure/service/token.service";
import { AuthEmailService } from "../../infrastructure/service/email.service";
import { NodemailerEmailService } from "../../../email/infrastructure/services/nodemailer-email.service";
import { ActivityTrackerService } from "../../../Activity.logger/application/services/activityTracker.service";
import { sendEmailByEventUC } from "../../../email/presentation/container/email-template.container";
import { AuthController } from "../controller/auth.controller";
import { OtpController } from "../controller/otp.controller";
import { RegistrationController } from "../controller/registration.controller";
import { AdminAuthController } from "../controller/admin.auth.controller";
import { TokenController } from "../controller/token.controller";
import { ForgotPasswordController } from "../controller/forgot-password.controller";
import { ChangePasswordController } from "../controller/updatePassword.controller";
import { GoogleController } from "../controller/google.controller";
import { EmailUpdateController } from "../controller/email-update.controller";
import { S3FileStorageRepository } from "../../../resume/infrastructure/storage/s3-file-storage.repository";
import { UpdateProfileImageUseCase } from "../../application/useCase/update-profile-image.usecase";
import { ProfileImageController } from "../controller/profile-image.controller";

const userRepo: UserRepository = new MongooseUserRepository();
const passwordPort: PasswordHasherPort = new PasswordService();
const tokenService: AuthTokenServicePort = new TokenService();
const googleAuthService: GoogleAuthPort = new GoogleService();
const activityTracker = new ActivityTrackerService();
const genericEmailService = new NodemailerEmailService();
const otpEmailService = new OtpEmailService(genericEmailService);
const passwordResetEmailService = new PasswordResetEmailService(
  genericEmailService,
);
const emailService = new AuthEmailService(passwordResetEmailService);
const otpService = new OTPService(otpEmailService);
const sendOtpUC = new SendRegistrationOTPUseCase(userRepo, otpService);
const verifyRegistrationUC = new VerifyRegistrationUseCase(
  userRepo,
  otpService,
  passwordPort,
  tokenService,
  activityTracker,
  sendEmailByEventUC,
);
const fileStorageRepo = new S3FileStorageRepository();
const updateProfileImageUC = new UpdateProfileImageUseCase(
  userRepo,
  fileStorageRepo,
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
const changePasswordUC = new UpdatePasswordUseCase(userRepo, passwordPort);
const googleLoginUC = new GoogleLoginUseCase(
  userRepo,
  googleAuthService,
  tokenService,
);
const requestEmailUpdateUC = new RequestEmailUpdateUseCase(
  userRepo,
  otpService,
);
const verifyEmailUpdateUC = new VerifyEmailUpdateUseCase(otpService, userRepo);

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
export const googleController = new GoogleController(googleLoginUC);
export const emailUpdateController = new EmailUpdateController(
  requestEmailUpdateUC,
  verifyEmailUpdateUC,
);
export const profileImageController = new ProfileImageController(
  updateProfileImageUC,
);
