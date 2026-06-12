import { z } from "zod";

export const parseResumeSchema = z.object({
  resumeId: z
    .string()
    .trim()
    .min(1, "Resume ID is required"),
});

export type ParseResumeSchema = z.infer<
  typeof parseResumeSchema
>;