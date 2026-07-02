import { z } from "zod";

export const RejectInterviewSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Reason is required")
    .max(1000, "Reason cannot exceed 1000 characters"),
});

export type RejectInterviewSchemaType = z.infer<
  typeof RejectInterviewSchema
>;