import { z } from "zod";

export const planIdParamSchema = z.object({
  planId: z
    .string()
    .trim()
    .min(1, "Plan ID is required")
    .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId"),
});
