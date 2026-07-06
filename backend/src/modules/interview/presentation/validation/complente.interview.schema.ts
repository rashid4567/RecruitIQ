import { z } from "zod";

export const CompleteInterviewSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});

export const UpdateInterviewNotesSchema = z.object({
  notes: z
    .string()
    .trim()
    .min(1, "Notes are required")
    .max(5000, "Notes cannot exceed 5000 characters"),
});