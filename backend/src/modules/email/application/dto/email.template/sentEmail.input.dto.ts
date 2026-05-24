import { EmailEvent } from "../../../domain/constant/templateEvents"; 

export interface sendEmailByInputDto{
    event : EmailEvent;
    to : string;
    variables : Record<string, string>
}