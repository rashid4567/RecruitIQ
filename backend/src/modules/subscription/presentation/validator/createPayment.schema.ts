import { z } from "zod";

export const CreatePaymentOrderSchema = z.object({
  planId: z
    .string()
    .trim()
    .min(1, "Plan id is required"),
});

export type CreatePaymentOrderDTO =
  z.infer<typeof CreatePaymentOrderSchema>;