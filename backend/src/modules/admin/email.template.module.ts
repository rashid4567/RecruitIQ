import { CreateEmailTempleteUseCase } from "./Application/use-Cases/email-template/create-email-template.usecase";
import { DeleteEmailTemplateUseCase } from "./Application/use-Cases/email-template/delete-email-template.usecase";
import { GetEmailTemplateUseCase } from "./Application/use-Cases/email-template/get-email-templates.usecase";
import { SendTestEmailUseCase } from "./Application/use-Cases/email-template/send-test-email.usecase";
import { toggleEmailTemplateUseCase } from "./Application/use-Cases/email-template/toggle-email-template.usecase";
import { UpdateEmailTemplateUseCase } from "./Application/use-Cases/email-template/update-email-template.usecase";
import { EmailTemplateRepository } from "./Domain/repositories/email-template.repository";
import { MongooseEmailTemplateRepository } from "./Infrastructure/repositories/email-template.repository";
import { EmailTemplateController } from "./Presentation/controller/email-template.mangment/email-template.controller";

const emailTemplateRepo: EmailTemplateRepository =
  new MongooseEmailTemplateRepository();

const createUC = new CreateEmailTempleteUseCase(emailTemplateRepo);
const updateUC = new UpdateEmailTemplateUseCase(emailTemplateRepo);
const listUC = new GetEmailTemplateUseCase(emailTemplateRepo);
const toggleUC = new toggleEmailTemplateUseCase(emailTemplateRepo);
const testEmailUC = new SendTestEmailUseCase(emailTemplateRepo);
const deleteUC = new DeleteEmailTemplateUseCase(emailTemplateRepo);

export const emailTemplateController = new EmailTemplateController(
  createUC,
  updateUC,
  listUC,
  toggleUC,
  testEmailUC,
  deleteUC,
);
