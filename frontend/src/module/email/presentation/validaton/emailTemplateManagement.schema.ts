import { z } from "zod";

export const testEmailSchema = z.object({
  templateId: z.string().trim().min(1, "Template ID required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

export const searchSchema = z
  .string()
  .max(100, "Search text too long")
  .optional();

export const paginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(50),
});

export const deleteTemplateSchema = z.object({
  templateId: z.string().trim().min(1),
});

export const toggleTemplateSchema = z.object({
  templateId: z.string().trim().min(1),
  active: z.boolean(),
});

export type SendTestEmailDTO = z.infer<typeof testEmailSchema>;
export type PaginationDTO = z.infer<typeof paginationSchema>;
