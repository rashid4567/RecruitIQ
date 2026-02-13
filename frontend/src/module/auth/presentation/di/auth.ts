import { ForgotPasswordUseCase } from "../../Application/useCases/forgotPassword.useCase";
import { GoogleAuthUseCase } from "../../Application/useCases/google-signin-UseCase";
import { RequestEmailUpdateUseCase } from "../../Application/useCases/Request-EmailUpdate.useCase";
import { ResendOTPUseCase } from "../../Application/useCases/resendOtp.useCase";
import { ResetPasswordUseCase } from "../../Application/useCases/reset-password.usecase";
import { SendOTPUseCase } from "../../Application/useCases/sentOtp-useCase";
import { SignInUseCase } from "../../Application/useCases/signin-useCases";
import { UpdatePasswordUsecase } from "../../Application/useCases/updatePassword.useCase";
import { VerifyOtpUseCase } from "../../Application/useCases/verifyOtp.useCase";
import { VerifyEmailUpdateUseCase } from "../../Application/useCases/verifyUpdate-Email.useCase";
import { ApiAuthRepository } from "../../infrastructure/repositories/ApiAuthRepository";

const authRepo = new ApiAuthRepository();

export const SignInUC = new SignInUseCase(authRepo);
export const googleAuthUseCase = new GoogleAuthUseCase(authRepo)
export const sentOtpUc = new SendOTPUseCase(authRepo);
export const verifyOtpUc = new VerifyOtpUseCase(authRepo);
export const resendOtpUc = new ResendOTPUseCase(authRepo);
export const forgotPasswordUc = new ForgotPasswordUseCase(authRepo);
export const resetPasswordUC = new ResetPasswordUseCase(authRepo);
export const updatePasswordUC = new UpdatePasswordUsecase(authRepo);
export const verifyEmailUpdateUc = new VerifyEmailUpdateUseCase(authRepo);
export const requestEmailUpdateUc = new  RequestEmailUpdateUseCase(authRepo);