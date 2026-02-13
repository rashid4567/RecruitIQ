export type EmailLogType = "TEST" | "REAL";
export type EmailLogStatus = "SENT" | "FAILED";

export interface EmailLog {
  type: EmailLogType;
  to: string;
  subject: string;
  status: EmailLogStatus;
  timeStamp: string;
  error?: string;
}
