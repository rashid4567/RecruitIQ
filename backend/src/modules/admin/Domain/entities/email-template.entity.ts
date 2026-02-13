export type EmailTemplateEvents = "JOB_APPLIED"| 'INTERVIEW_SCHEDULED'| 'SELECTED' | 'REJECTED'| "ACCOUNT_CREATED" | "SUBSCRIPTION_EXPIRING"| "SUBSCRIPTION_EXPIRED";

export class EmailTemplate{
    constructor(
        public readonly id : string,
        public  name : string,
        public event : EmailTemplateEvents,
        public subject : string,
        public body : string,
        public isActive : boolean,
        public createdAt : Date,
    ){};

}