import { AdminLoginUseCase } from "./application/useCase/admin-login.usecase";
import { LoginUseCase } from "./application/useCase/login.useCase";
import { RefreshTokenUseCase } from "./application/useCase/refreshToken.useCase";
import { SendRegistrationOTPUseCase } from "./application/useCase/send-registration-otp.usecase";
import { VerifyRegistrationUseCase } from "./application/useCase/verify-registration.usecase";

import { UserRepository } from "./domain/repositories/user.repository";
import { MongooseUserRepository } from "./infrastructure/repositories/mongoose-use.repository";
import { OTPService } from "./infrastructure/service/otp.service";

import { PasswordService } from "./infrastructure/service/password.service";
import { ProfileService } from "./infrastructure/service/profile.service";
import { TokenService } from "./infrastructure/service/token.service";

import { AuthController } from "./presentation/auth.controller";


const userRepo: UserRepository = new MongooseUserRepository();
const passwordService = new PasswordService();
const tokenService = new TokenService();
const profileService = new ProfileService();

const otpService = new OTPService()



const sendOtpUC = new SendRegistrationOTPUseCase(
  userRepo,
  otpService
);

const verifyRegistrationUC = new VerifyRegistrationUseCase(
  userRepo,
  otpService,
  passwordService,
  tokenService,
  profileService
);

const loginUC = new LoginUseCase(
  userRepo,
  passwordService,
  tokenService
);

const adminLoginUC = new AdminLoginUseCase(loginUC);

const refreshTokenUC = new RefreshTokenUseCase(
  userRepo,
  tokenService,
);



export const authController = new AuthController(
  sendOtpUC,
  verifyRegistrationUC,
  loginUC,
  adminLoginUC,
  refreshTokenUC
);
