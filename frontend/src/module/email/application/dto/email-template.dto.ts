export type EmailTemplateEvent =
  | "JOB_APPLIED"
  | "INTERVIEW_SCHEDULED"
  | "SELECTED"
  | "REJECTED"
  | "ACCOUNT_CREATED"
  | "SUBSCRIPTION_EXPIRING"
  | "SUBSCRIPTION_EXPIRED";


    export interface EmailTemplate{
        id : string,
        name : string,
        event : EmailTemplateEvent,
        subject : string,
        body : string,
        isActive : boolean,
        createdAt : string,
    }

    
    export interface createEmailTemplatePayload {
        name : string,
        event : EmailTemplateEvent,
        subject : string,
        body : string,
    }

    
    export interface UpdateEmailTemplatePayload {
        subject?:string,
        body?:string,
    }

    export interface ToggleEmailInputPayload {
        isActive : boolean,
    }
    export interface sendTestEmailPayload {
        id : string,
        email : string,
    }