import { EmailEvent } from "../../../Domain/constatns/email-enum.events";

export interface sendEmailByInputDto{
    event : EmailEvent;
    to : string;
    variables : Record<string, string>
}