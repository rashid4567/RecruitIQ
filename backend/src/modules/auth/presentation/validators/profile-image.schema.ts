import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const profileImageSchema = z.object({
  mimetype: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]),
  size: z
    .number()
    .max(MAX_FILE_SIZE, "Image size cannot exceed 5MB"),
});