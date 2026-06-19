import { EmailEvent } from "../constant/templateEvents";
import { DomainError } from "../../../../shared/errors/domain.error";
import { DOMAIN_ERROR_CODES } from "../../../../constants/domain.error.code";

export class EmailTemplate {
  constructor(
    public readonly id: string,
    public name: string,
    public event: EmailEvent,
    public subject: string,
    public body: string,
    public isActive: boolean,
    public createdAt: Date,
  ) {
    if (!name.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.TEMPLATE_NAME_IS_REQUIRED);
    }
    if (!subject.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.SUBJECT_REQUIRED);
    }
  }

  toggleStatus() {
    this.isActive = !this.isActive;
  }

  updateContent(subject: string, body: string) {
    if (!subject.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.SUBJECT_REQUIRED);
    }
    if (!body.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.BODY_REQUIRED);
    }
    this.subject = subject;
    this.body = body;
  }
}
