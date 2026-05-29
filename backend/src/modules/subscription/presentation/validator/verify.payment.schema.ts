import { z } from "zod";

export const VerifyPaymentSchema = z.object({
  razorpayOrderId: z
    .string()
    .trim()
    .min(1),

  razorpayPaymentId: z
    .string()
    .trim()
    .min(1),

  razorpaySignature: z
    .string()
    .trim()
    .min(1),
});

export type VerifyPaymentDTO =
  z.infer<typeof VerifyPaymentSchema>;