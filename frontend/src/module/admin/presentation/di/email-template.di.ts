import { CreateEmailTemplateUseCase } from "../../application/useCases/email-templates/create-email-template.usecase";
import { DeleteEmailTemplateUseCase } from "../../application/useCases/email-templates/delete-email-template.usecase";
import { GetEmailTemplatesUseCase } from "../../application/useCases/email-templates/get-email-templates.usecase";
import { SendTestEmailUseCase } from "../../application/useCases/email-templates/send-test-email.usecase";
import { ToggleEmailTempleteUseCase } from "../../application/useCases/email-templates/toggle-email-template.usecase";
import { UpdateEmailTemplateUseCase } from "../../application/useCases/email-templates/update-email-template.usecase";
import { ApiEmailTemplateRepository } from "../../infrastructure/repositories/api-email-template.repository";

const EmailTemplateRepo = new ApiEmailTemplateRepository();

export const CreateEmailTemplateUC = new CreateEmailTemplateUseCase(
  EmailTemplateRepo,
);
export const UpdateEmailTemplateUC = new UpdateEmailTemplateUseCase(
  EmailTemplateRepo,
);
export const GetEmailTemplateUC = new GetEmailTemplatesUseCase(
  EmailTemplateRepo,
);
export const DeleteEmailTemplateUC = new DeleteEmailTemplateUseCase(
  EmailTemplateRepo,
);
export const ToggleEmailTempleteUC = new ToggleEmailTempleteUseCase(
  EmailTemplateRepo,
);
export const sendTestEmailUC = new SendTestEmailUseCase(EmailTemplateRepo);
