import { DomainError } from "../error/domain.errors";
import { DOMAIN_ERRORS } from "../error/error.codes";
export class EmailLog {
  constructor(
    public readonly id: string,
    public readonly type:
      | "TEST"
      | "REAL",
    public readonly to: string,
    public readonly subject: string,
    public readonly status:
      | "SENT"
      | "FAILED",
    public readonly createdAt: Date,
    public readonly error?: string,
  ) {

    if (!to.trim()) {
      throw new DomainError(
        DOMAIN_ERRORS.EMAIL_REQUIRED
      );
    }
    if (!subject.trim()) {
      throw new DomainError(
        DOMAIN_ERRORS.SUBJECT_REQUIRED
      );
    }
    if (
      status === "FAILED"
      &&
      !error
    ) {
      throw new DomainError(
        DOMAIN_ERRORS.ERROR_MESSAGE_REQUIRED
      );
    }

    if (
      status === "SENT"
      &&
      error
    ) {
      throw new DomainError(
        DOMAIN_ERRORS.INVALID_EMAIL_LOG_STATE
      );
    }
  }
  isFailed(): boolean {
    return this.status === "FAILED";
  }
  isSent(): boolean {
    return this.status === "SENT";
  }
}