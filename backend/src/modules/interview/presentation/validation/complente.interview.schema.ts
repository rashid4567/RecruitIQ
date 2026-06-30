import { z } from "zod";

export const CompleteInterviewSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional(),
});