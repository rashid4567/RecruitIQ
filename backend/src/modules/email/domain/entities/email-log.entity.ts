import { DomainError } from "../../../../shared/errors/domain.error";
import { DOMAIN_ERROR_CODES } from "../../../../shared/constants/domain.error.code";
export class EmailLog {
  constructor(
    public readonly id: string,
    public readonly type: "TEST" | "REAL",
    public readonly to: string,
    public readonly subject: string,
    public readonly status: "SENT" | "FAILED",
    public readonly createdAt: Date,
    public readonly error?: string,
  ) {
    if (!to.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.EMAIL_REQUIRED);
    }
    if (!subject.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.SUBJECT_REQUIRED);
    }
    if (status === "FAILED" && !error) {
      throw new DomainError(DOMAIN_ERROR_CODES.ERROR_MESSAGE_REQUIRED);
    }

    if (status === "SENT" && error) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_EMAIL_LOG_STATE);
    }
  }
  isFailed(): boolean {
    return this.status === "FAILED";
  }
  isSent(): boolean {
    return this.status === "SENT";
  }
}
