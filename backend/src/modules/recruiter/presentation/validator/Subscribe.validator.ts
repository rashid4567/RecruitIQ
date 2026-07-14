import { z } from "zod";
import { SubscriptionStatus } from "../../../subscription/domain/entities/recruiter-subscription.entity"; 

export const subscribeSchema = z
  .object({
    planId: z
      .string()
      .min(1, { message: "planId cannot be empty" }),

    razorpaySubscriptionId: z
      .string()
      .min(1, { message: "razorpaySubscriptionId cannot be empty" })
      .optional(),

    razorpayOrderId: z
      .string()
      .min(1, { message: "razorpayOrderId cannot be empty" })
      .optional(),

    razorpayCustomerId: z
      .string()
      .min(1, { message: "razorpayCustomerId cannot be empty" })
      .optional(),

    startDate: z
      .string()
      .datetime({ message: "startDate must be a valid ISO datetime string" })
      .transform((val) => new Date(val)),

    endDate: z
      .string()
      .datetime({ message: "endDate must be a valid ISO datetime string" })
      .transform((val) => new Date(val)),

    renewsAt: z
      .string()
      .datetime({ message: "renewsAt must be a valid ISO datetime string" })
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),

    autoRenew: z.boolean(),

    status: z.nativeEnum(SubscriptionStatus),
  })
  .strict()
  .refine((data) => data.startDate < data.endDate, {
    message: "startDate must be before endDate",
    path: ["startDate"],
  });

export type SubscribeInput = z.infer<typeof subscribeSchema>;