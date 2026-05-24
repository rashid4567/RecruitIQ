import { z } from "zod";

export const paginationQuerySchema = z
  .object({
    page: z.coerce
      .number("Page must be a number")
      .int({ message: "Page must be an integer" })
      .min(1, { message: "Page must be at least 1" })
      .optional()
      .default(1),
    limit: z.coerce
      .number("Limit must be a number")
      .int({ message: "Limit must be an integer" })
      .min(1, { message: "Limit must be at least 1" })
      .max(50, { message: "Limit must not exceed 50" })
      .optional()
      .default(10),
  })
  .strict();

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;