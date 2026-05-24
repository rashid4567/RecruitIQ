import { DomainError } from "../../../../shared/errors/domain.error";
import { DOMAIN_ERROR_CODES } from "../constants/DomainError";
import { ResetToken } from "../value.objects/reset-token.vo";

export class PasswordReset {
  private constructor(
    public readonly userId: string,
    public readonly token: ResetToken,
    public readonly expiresAt: Date,
  ) {}

  public static create(
    userId: string,
    token: ResetToken,
    expiresAt: Date,
  ): PasswordReset {
    if (!userId) {
      throw new DomainError(DOMAIN_ERROR_CODES.USER_ID_REQUIRED);
    }
    if (expiresAt <= new Date()) {
      throw new DomainError(DOMAIN_ERROR_CODES.EXPIRY_TOKEN_MUST_BE_IN_FUTURE);
    }
    return new PasswordReset(userId, token, expiresAt);
  }
  public isExpired(now: Date = new Date()): boolean {
    return this.expiresAt <= now;
  }
}
