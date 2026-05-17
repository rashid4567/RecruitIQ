export type EmailLogType = "TEST" | "REAL";

export type EmailLogStatus = "SENT" | "FAILED";

export interface EmailLogProps {
  id: string;
  to: string;
  subject: string;
  type: EmailLogType;
  status: EmailLogStatus;
  timeStamp: string;
  error?: string;
}

export class EmailLog {
  public readonly props: EmailLogProps;
  constructor(props: EmailLogProps) {
    this.props = props;
  }
  getId(): string {
    return this.props.id;
  }
  getRecipient(): string {
    return this.props.to;
  }
  getSubject(): string {
    return this.props.subject;
  }
  getType(): EmailLogType {
    return this.props.type;
  }
  getStatus(): EmailLogStatus {
    return this.props.status;
  }
  getError(): string | undefined {
    return this.props.error;
  }
  getTimeStamp(): string {
    return this.props.timeStamp;
  }
  isSent(): boolean {
    return this.props.status === "SENT";
  }
  isFailed(): boolean {
    return this.props.status === "FAILED";
  }
}
