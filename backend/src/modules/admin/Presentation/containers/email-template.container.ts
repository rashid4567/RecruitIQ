import { CreateEmailTemplateUseCase } from "../../Application/use-Cases/email-template/create-email-template.usecase";
import { DeleteEmailTemplateUseCase } from "../../Application/use-Cases/email-template/delete-email-template.usecase";
import { GetEmailTemplatesUseCase } from "../../Application/use-Cases/email-template/get-email-templates.usecase";
import { SendTestEmailUseCase } from "../../Application/use-Cases/email-template/send-test-email.usecase";
import { toggleEmailTemplateUseCase } from "../../Application/use-Cases/email-template/toggle-email-template.usecase";
import { UpdateEmailTemplateUseCase } from "../../Application/use-Cases/email-template/update-email-template.usecase";
import { EmailTemplateRepository } from "../../Domain/repositories/email-template.repository";
import { MongooseEmailTemplateRepository } from "../../Infrastructure/repositories/email-template.repository";
import { CreateEmailTemplateController } from "../controller/email-template.mangment/create-email-template.controller";
import { DeleteEmailTemplateController } from "../controller/email-template.mangment/delete-email-template.controller";
import { ListEmailTemplateController } from "../controller/email-template.mangment/list-emil.template.controller";
import { SendTestEmailController } from "../controller/email-template.mangment/send-test-email.controller";
import { ToggleEmailTemplateController } from "../controller/email-template.mangment/toggle-Email.template.controller";
import { UpdateEmailTemplateController } from "../controller/email-template.mangment/update-email-Template.controller";

const emailTemplateRepo: EmailTemplateRepository =
  new MongooseEmailTemplateRepository();

const createEmailTemplateUC = new CreateEmailTemplateUseCase(emailTemplateRepo);

const updateEmailTemplateUC = new UpdateEmailTemplateUseCase(emailTemplateRepo);

const getEmailTemplatesUC = new GetEmailTemplatesUseCase(emailTemplateRepo);

const toggleEmailTemplateUC = new toggleEmailTemplateUseCase(emailTemplateRepo);

const sendTestEmailUC = new SendTestEmailUseCase(emailTemplateRepo);

const deleteEmailTemplateUC = new DeleteEmailTemplateUseCase(emailTemplateRepo);

export const createEmailTemplateController = new CreateEmailTemplateController(
  createEmailTemplateUC,
);

export const updateEmailTemplateController = new UpdateEmailTemplateController(
  updateEmailTemplateUC,
);

export const getEmailTemplatesController = new ListEmailTemplateController(
  getEmailTemplatesUC,
);

export const toggleEmailTemplateController = new ToggleEmailTemplateController(
  toggleEmailTemplateUC,
);

export const sendTestEmailController = new SendTestEmailController(
  sendTestEmailUC,
);

export const deleteEmailTemplateController = new DeleteEmailTemplateController(
  deleteEmailTemplateUC,
);
