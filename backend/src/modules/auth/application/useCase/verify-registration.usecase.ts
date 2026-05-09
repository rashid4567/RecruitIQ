import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";

import { Email } from "../../../../shared/value-objects/email.vo";
import { Password } from "../../../../shared/value-objects/password.vo";

import { VerificationInput } from "../dto/verification.input.dto";
import { OTPServicePort } from "../ports/otp.service.ports";
import { PasswordHasherPort } from "../../domain/ports/password-hasher.port";
import { AuthTokenServicePort } from "../ports/token.service.ports";

import { ApplicationError } from "../../../../shared/errors/application.error";
import { ERROR_CODES } from "../constants/error-codes.constants";

import { EmailEvent } from "../../../admin/Domain/constatns/email-enum.events";
import { ActivityTrackerService } from "../../../../shared/ActivityLogger/service/activityTracker.service";
import { ActivityAction } from "../../../../shared/ActivityLogger/constants/activityActions";
import { SendEmailByEventUseCase } from "../../../admin/Application/use-Cases/email-template/send-email-by-event.usecase";

export class VerifyRegistrationUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpRepo: OTPServicePort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenService: AuthTokenServicePort,
    private readonly activityTracker: ActivityTrackerService,
    private readonly sendEmailByEventUC: SendEmailByEventUseCase,
  ) {}

  async execute(input: VerificationInput) {

    let email: Email;
    try {
      email = Email.create(input.email);
    } catch {
      throw new ApplicationError(ERROR_CODES.INVALID_EMAIL);  
    }

    if (!input.otp || !/^\d{6}$/.test(input.otp)) {
      throw new ApplicationError(ERROR_CODES.INVALID_OTP);    
    }


    try {
      await this.otpRepo.verify(email, input.otp, input.role);
    } catch (err) {

      if (err instanceof ApplicationError) throw err;
      const msg = (err as Error)?.message?.toLowerCase() ?? "";
      if (msg.includes("expired")) {
        throw new ApplicationError(ERROR_CODES.OTP_EXPIRED);       
      }
      if (
        msg.includes("invalid") ||
        msg.includes("incorrect") ||
        msg.includes("wrong") ||
        msg.includes("mismatch")
      ) {
        throw new ApplicationError(ERROR_CODES.INVALID_OTP);       
      }
      if (msg.includes("used") || msg.includes("already verified")) {
        throw new ApplicationError(ERROR_CODES.OTP_ALREADY_USED);  
      }
      if (msg.includes("not found") || msg.includes("no otp")) {
        throw new ApplicationError(ERROR_CODES.OTP_NOT_FOUND);   
      }


      throw new ApplicationError(ERROR_CODES.INVALID_OTP);
    }

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new ApplicationError(ERROR_CODES.USER_ALREADY_EXISTS);
    }


    let password: Password;
    try {
      password = Password.create(input.password);
    } catch {
      throw new ApplicationError(ERROR_CODES.INVALID_PASSWORD);    
    }

  
    const passwordHash = await this.passwordHasher.hash(password);

    const user = User.register({
      email,
      role: input.role,
      fullName: input.fullName,
      passwordHash,
    });

    const savedUser = await this.userRepo.save(user);


    try {
      this.activityTracker.track({
        userId: savedUser.id!,
        action: ActivityAction.USER_CREATED,
        entityType: "User",
        entityId: savedUser.id!,
        metadata: {
          fullName: savedUser.fullName,
          email: savedUser.email.getValue(),
          role: savedUser.role,
        },
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }

    try {
      await this.sendEmailByEventUC.execute({
        to: savedUser.email.getValue(),
        event: EmailEvent.ACCOUNT_CREATED,
        variables: {
          name: savedUser.fullName,
          email: savedUser.email.getValue(),
        },
      });
    } catch (err) {
      console.error("ACCOUNT_CREATED email failed:", err);
    }

    return {
      accessToken: this.tokenService.generateAccessToken(
        savedUser.id!,
        savedUser.role,
      ),
      refreshToken: this.tokenService.generateRefreshToken(savedUser.id!),
      user: {
        id: savedUser.id!,
        role: savedUser.role,
        fullName: savedUser.fullName,
      },
    };
  }
}