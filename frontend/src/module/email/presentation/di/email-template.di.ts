import { CreateEmailTemplateUseCase } from "../../../email/application/usecase/email-templates/create-email-template.usecase";
import { DeleteEmailTemplateUseCase } from "../../../email/application/usecase/email-templates/delete-email-template.usecase";
import { GetEmailTemplatesUseCase } from "../../../email/application/usecase/email-templates/get-email-templates.usecase";
import { SendTestEmailUseCase } from "../../../email/application/usecase/email-templates/send-test-email.usecase";
import { ToggleEmailTempleteUseCase } from "../../../email/application/usecase/email-templates/toggle-email-template.usecase";
import { UpdateEmailTemplateUseCase } from "../../../email/application/usecase/email-templates/update-email-template.usecase";
import { ApiEmailTemplateRepository } from "../../../email/infrastructure/repositories/api-email-template.repository";

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
