import { Router } from "express";
import {
  createEmailTemplateController,
  deleteEmailTemplateController,
  getEmailTemplatesController,
  sendTestEmailController,
  toggleEmailTemplateController,
  updateEmailTemplateController,
} from "../containers/email-template.container";

const emailTemplateRouter = Router();

emailTemplateRouter.post(
  "/",
  createEmailTemplateController.createEmailTemplate,
);

emailTemplateRouter.get("/", getEmailTemplatesController.listEmailTemplates);

emailTemplateRouter.put(
  "/:id",
  updateEmailTemplateController.updateEmailTemplate,
);

emailTemplateRouter.patch(
  "/:id/toggle",
  toggleEmailTemplateController.toggleEmailTemplate,
);

emailTemplateRouter.post("/:id/test", sendTestEmailController.sendTestEmail);

emailTemplateRouter.delete(
  "/:id",
  deleteEmailTemplateController.deleteEmailTemplate,
);

export default emailTemplateRouter;
