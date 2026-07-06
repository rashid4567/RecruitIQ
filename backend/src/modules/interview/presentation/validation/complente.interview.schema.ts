import { z } from "zod";

export const CompleteInterviewSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});