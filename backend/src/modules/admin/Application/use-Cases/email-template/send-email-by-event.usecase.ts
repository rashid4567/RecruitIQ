import { renderTemplate } from "../../../../../utils/template-renderer";
import { EmailTemplateRepository } from "../../../Domain/repositories/email-template.repository";
import { EmailService } from "../../../Domain/services/email.service";
import { sendEmailByInputDto } from "../../dto/email.template/sentEmail.input.dto";



export class SendEmailByEventUseCase{
    constructor(
        private readonly templateRepo : EmailTemplateRepository,
        private readonly emailService : EmailService,
    ){};

    async execute(input : sendEmailByInputDto):Promise<void>{
        const template = await this.templateRepo.findByEvent(input.event);

        if(!template || !template.isActive){
            return;
        }


        const subject = renderTemplate(template.subject, input.variables);
        const body = renderTemplate(template.body, input.variables);

        await this.emailService.send({
            to : input.to,
            subject,
            body,
            type : "REAL",
        })
    }
}