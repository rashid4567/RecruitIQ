import { z } from "zod";

export const RefreshSchema = z.object({
  refreshToken: z.string().min(10),
});
