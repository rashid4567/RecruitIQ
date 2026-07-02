export type EmailLogType = "TEST" | "REAL";
export type EmailLogStatus = "SENT" | "FAILED";

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  type: EmailLogType;
  status: EmailLogStatus;
  createdAt: string;
  error?: string;
}

export type EmailTemplateEvent =
  | "ACCOUNT_CREATED"
  | "JOB_APPLIED"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEW_RESCHEDULED"
  | "INTERVIEW_RESCHEDULE_REQUEST_REJECTED"
  | "SELECTED"
  | "REJECTED"
  | "SUBSCRIPTION_PURCHASED"
  | "SUBSCRIPTION_EXPIRING"
  | "SUBSCRIPTION_EXPIRED";

export interface EmailTemplate {
  id: string;
  name: string;
  event: EmailTemplateEvent;
  subject: string;
  body: string;
  isActive: boolean;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  event: EmailTemplateEvent;
  subject: string;
  body: string;
  isActive: boolean;
  createdAt: string;
}

export interface createEmailTemplatePayload {
  name: string;
  event: EmailTemplateEvent;
  subject: string;
  body: string;
}

export interface UpdateEmailTemplatePayload {
  subject?: string;
  body?: string;
}

export interface ToggleEmailInputPayload {
  isActive: boolean;
}
export interface sendTestEmailPayload {
  id: string;
  email: string;
}
