import { z } from "zod";

export const cancelSubscriptionSchema = z
  .object({
    note: z
      .string()
      .max(500, { message: "Note must not exceed 500 characters" })
      .optional(),

    cancelAtPeriodEnd: z.boolean(),
  })
  .strict()
  .refine((data) => typeof data.cancelAtPeriodEnd === "boolean", {
    message: "cancelAtPeriodEnd is required and must be a boolean",
    path: ["cancelAtPeriodEnd"],
  });

export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;