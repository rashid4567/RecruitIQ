export type EmailTemplateEvent =
  | "JOB_APPLIED"
  | "INTERVIEW_SCHEDULED"
  | "SELECTED"
  | "REJECTED"
  | "ACCOUNT_CREATED"
  | "SUBSCRIPTION_EXPIRING"
  | "SUBSCRIPTION_EXPIRED";

interface EmailTemplateProps {
  id: string;
  name: string;
  event: EmailTemplateEvent;
  subject: string;
  body: string;
  isActive: boolean;
  createdAt: string;
}

export class EmailTemplate {
  private readonly props: EmailTemplateProps;

  constructor(props: EmailTemplateProps) {
    this.props = props;
  }

  getId() {
    return this.props.id;
  }

  getName() {
    return this.props.name;
  }

  getEvent() {
    return this.props.event;
  }

  getSubject() {
    return this.props.subject;
  }

  getBody() {
    return this.props.body;
  }

  isActive() {
    return this.props.isActive;
  }

  getCreatedAt() {
    return this.props.createdAt;
  }
}
