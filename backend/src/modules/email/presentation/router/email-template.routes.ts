import { Router } from "express";
import {
  createEmailTemplateController,
  deleteEmailTemplateController,
  getEmailTemplatesController,
  sendTestEmailController,
  toggleEmailTemplateController,
  updateEmailTemplateController,
} from "../../../email/presentation/container/email-template.container";
import { EMAIL_ROUTES } from "../constants/email-routes.constant";

const emailTemplateRouter = Router();
emailTemplateRouter.post(
  EMAIL_ROUTES.ROOT,
  createEmailTemplateController.createEmailTemplate,
);
emailTemplateRouter.get(EMAIL_ROUTES.ROOT, getEmailTemplatesController.listEmailTemplates);
emailTemplateRouter.put(
  EMAIL_ROUTES.BY_ID,
  updateEmailTemplateController.updateEmailTemplate,
);
emailTemplateRouter.patch(
  EMAIL_ROUTES.TOGGLE,
  toggleEmailTemplateController.toggleEmailTemplate,
);
emailTemplateRouter.post(EMAIL_ROUTES.TEST, sendTestEmailController.sendTestEmail);
emailTemplateRouter.delete(
  EMAIL_ROUTES.BY_ID,
  deleteEmailTemplateController.deleteEmailTemplate,
);

export default emailTemplateRouter;
