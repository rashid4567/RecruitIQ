import { z } from "zod";
import { EVENTS } from "../constant/templateEvents";


const eventValues = EVENTS.map((e) => e.value);

if (eventValues.length === 0) {
  throw new Error("EVENTS must contain at least one value");
}

export const eventSchema = z.enum(
  eventValues as [string, ...string[]],
  {
    message: "Invalid event selected",
  }
);

const templateNameSchema = z
  .string()
  .trim()
  .min(3, "Template name must be at least 3 characters")
  .max(100, "Template name too long");

const subjectSchema = z
  .string()
  .trim()
  .min(3, "Subject is required")
  .max(200, "Subject too long");

const bodySchema = z
  .string()
  .trim()
  .min(10, "Email body must be at least 10 characters")
  .max(50000, "Email body too large");

const templateIdSchema = z
  .string()
  .trim()
  .min(1, "Template must be saved first");

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email address");


export const createEmailTemplateSchema = z.object({
  name: templateNameSchema,
  event: eventSchema,
  subject: subjectSchema,
  body: bodySchema,
});


export const updateEmailTemplateSchema = z.object({
  id: templateIdSchema,
  subject: subjectSchema,
  body: bodySchema,
});


export const emailTemplateFormSchema = z.object({
  id: z.string().optional(),
  name: templateNameSchema,
  event: eventSchema,
  subject: subjectSchema,
  body: bodySchema,
});


export const sendTestEmailSchema = z.object({
  templateId: templateIdSchema,
  email: emailSchema,
});


export type EmailTemplateForm = z.infer<typeof emailTemplateFormSchema>;
export type CreateEmailTemplateDTO = z.infer<typeof createEmailTemplateSchema>;
export type UpdateEmailTemplateDTO = z.infer<typeof updateEmailTemplateSchema>;
export type SendTestEmailDTO = z.infer<typeof sendTestEmailSchema>;