import { z } from "zod";

export const RefreshSchema = z.object({
  refreshToken: z
    .string()
    .trim()
    .min(20, "Invalid refresh token")
    .max(2000, "Refresh token is too long"),
});

export type RefreshDTO = z.infer<
  typeof RefreshSchema
>;