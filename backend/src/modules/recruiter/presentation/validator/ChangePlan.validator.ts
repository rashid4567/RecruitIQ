import { z } from "zod";

export const changePlanSchema = z
  .object({
    newPlanId: z
      .string("newPlanId must be a string")
      .min(1, { message: "newPlanId cannot be empty" }),
    newEndDate: z
      .string("newEndDate must be a string")
      .datetime({ message: "newEndDate must be a valid ISO datetime string" }),
    newRazorpaySubscriptionId: z
      .string("newRazorpaySubscriptionId must be a string")
      .min(1, { message: "newRazorpaySubscriptionId cannot be empty" })
      .optional(),
  })
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type ChangePlanInput = z.infer<typeof changePlanSchema>;