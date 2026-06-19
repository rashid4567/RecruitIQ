import { z } from "zod";

export const UpdateEmailTemplateSchema = z
  .object({
    subject: z
      .string()
      .trim()
      .min(1, "Subject cannot be empty")
      .optional(),

    body: z
      .string()
      .trim()
      .min(1, "Body cannot be empty")
      .optional(),
  })
  .refine(
    (data) =>
      data.subject !== undefined ||
      data.body !== undefined,
    {
      message:
        "At least one field (subject or body) must be provided",
    },
  );

export type UpdateEmailTemplateInputDto =
  z.infer<
    typeof UpdateEmailTemplateSchema
  >;