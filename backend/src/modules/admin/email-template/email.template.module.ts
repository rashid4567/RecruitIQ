import { updatePasswordUseCase } from "../../candidate/application/use-cases/update-password.usecase";
import { CreateEmailTempleteUseCase } from "./application/use-cases/create-email-template.usecase";
import { DeleteEmailTemplateUseCase } from "./application/use-cases/delete-email-template.usecase";
import { GetEmailTemplateUseCase } from "./application/use-cases/get-email-templates.usecase";
import { SendTestEmailUseCase } from "./application/use-cases/send-test-email.usecase";
import { toggleEmailTemplateUseCase } from "./application/use-cases/toggle-email-template.usecase";
import { UpdateEmailTemplateUseCase } from "./application/use-cases/update-email-template.usecase";
import { EmailTemplateRepository } from "./domain/repostories/email-template.repository";
import { MongooseEmailTemplateRepository } from "./infrastructure/mongoose/email-template.repository";
import { EmailTemplateController } from "./presentation/email-template.controller";


const emailTemplateRepo : EmailTemplateRepository = new MongooseEmailTemplateRepository();

const createUC = new CreateEmailTempleteUseCase(emailTemplateRepo);
const updateUC = new UpdateEmailTemplateUseCase(emailTemplateRepo)
const listUC = new GetEmailTemplateUseCase(emailTemplateRepo);
const toggleUC = new toggleEmailTemplateUseCase(emailTemplateRepo)
const testEmailUC = new SendTestEmailUseCase(emailTemplateRepo)
const deleteUC = new DeleteEmailTemplateUseCase(emailTemplateRepo)

export const emailTemplateController = new EmailTemplateController(
    createUC,
    updateUC,
    listUC,
    toggleUC,
    testEmailUC,
    deleteUC,
)