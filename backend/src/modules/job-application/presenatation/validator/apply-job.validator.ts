import { z } from "zod";

export const applyJobSchema = z.object({
  jobId: z
    .string()
    .trim()
    .min(1, "Job ID is required"),

  resumeId: z
    .string()
    .trim()
    .min(1, "Resume ID is required"),

  coverLetter: z
    .string()
    .trim()
    .max(5000, "Cover letter cannot exceed 5000 characters")
    .optional(),
});

export type ApplyJobInput = z.infer<
  typeof applyJobSchema
>;