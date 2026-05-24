import { z } from "zod";

export const renewSubscriptionSchema = z
  .object({
    newStartDate: z
      .string("newStartDate must be a string")
      .datetime({
        message: "newStartDate must be a valid ISO datetime string",
      }),
    newEndDate: z
      .string("newEndDate must be a string")
      .datetime({ message: "newEndDate must be a valid ISO datetime string" }),
    newRenewsAt: z
      .string("newRenewsAt must be a string")
      .datetime({ message: "newRenewsAt must be a valid ISO datetime string" })
      .optional(),
  })
  .strict()
  .refine((data) => new Date(data.newStartDate) < new Date(data.newEndDate), {
    message: "newStartDate must be before newEndDate",
    path: ["newStartDate"],
  });

export type RenewSubscriptionInput = z.infer<typeof renewSubscriptionSchema>;
