import crypto from "crypto";

import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { Email } from "../../../domain/value.objects/email.vo";
import { Password } from "../../../domain/value.objects/password-hash.vo";
import { PasswordHasherPort } from "../../../domain/ports/password-hasher.port";
import { OTPServicePort } from "../../ports/otp.service.ports";
import { AuthTokenServicePort } from "../../ports/token.service.ports";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  VerificationInput,
  VerifyRegistrationResponseDTO,
} from "../../dto/verification.input.dto";
import { ActivityTrackerService } from "../../../../Activity.logger/application/services/activityTracker.service";
import { ActivityAction } from "../../../../Activity.logger/domain/constants/activityActions";
import { EmailEvent } from "../../../../admin/Domain/constatns/email-enum.events";
import { sendEmailByInputDto } from "../../../../email/application/dto/email.template/sentEmail.input.dto";
import { AssignFreeSubscriptionUseCase } from "../../../../subscription/application/usecase/Recruiter/AssignFreeSubscriptionUseCase";

export class VerifyRegistrationUseCase implements IUseCase<
  VerificationInput,
  VerifyRegistrationResponseDTO
> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpRepo: OTPServicePort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenService: AuthTokenServicePort,
    private readonly activityTracker: ActivityTrackerService,
    private readonly sendEmailByEventUC: IUseCase<sendEmailByInputDto, void>,
    private readonly assignFreeSubscriptionUC: AssignFreeSubscriptionUseCase,
  ) {}

  async execute(
    request: VerificationInput,
  ): Promise<VerifyRegistrationResponseDTO> {
    let email: Email;

    try {
      email = Email.create(request.email);
    } catch {
      throw new ApplicationError(ERROR_CODES.INVALID_EMAIL);
    }
    if (!request.otp || !/^\d{6}$/.test(request.otp)) {
      throw new ApplicationError(ERROR_CODES.INVALID_OTP);
    }
    try {
      await this.otpRepo.verify(email, request.otp, request.role);
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
      password = Password.create(request.password);
    } catch {
      throw new ApplicationError(ERROR_CODES.INVALID_PASSWORD);
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const user = User.register({
      email,
      role: request.role,
      fullName: request.fullName,
      passwordHash,
    });

    const savedUser = await this.userRepo.save(user);
    if (savedUser.role === "recruiter") {
      await this.assignFreeSubscriptionUC.execute(savedUser.id!);
    }

    try {
      await this.activityTracker.track({
        id: crypto.randomUUID(),
        userId: savedUser.id!,
        action: ActivityAction.USER_CREATED,
        entityType: "USER",
        entityId: savedUser.id!,
        metadata: {
          fullName: savedUser.fullName,
          email: savedUser.email.getValue(),
          role: savedUser.role,
        },
        createdAt: new Date(),
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
