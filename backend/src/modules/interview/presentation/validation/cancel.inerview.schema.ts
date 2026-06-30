import { z } from "zod";

export const CancelInterviewSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Cancellation reason is required")
    .max(500, "Cancellation reason cannot exceed 500 characters"),
});

export type CancelInterviewSchemaType = z.infer<
  typeof CancelInterviewSchema
>;