import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .regex(
      /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/,
      "Please enter a valid full name"
    ),

  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters")
    .regex(
      /^[A-Za-z0-9&.,'()\- ]+$/,
      "Company name contains invalid characters"
    ),

  companyWebsite: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      {
        message: "Company website must be a valid URL",
      }
    ),

  companySize: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine(
      (val) => Number.isInteger(val),
      {
        message: "Company size must be an integer",
      }
    )
    .refine(
      (val) => val > 0,
      {
        message: "Company size must be greater than 0",
      }
    )
    .refine(
      (val) => val <= 1000000,
      {
        message: "Company size is too large",
      }
    ),

  industry: z
    .string()
    .trim()
    .min(2, "Industry must be at least 2 characters")
    .max(50, "Industry must not exceed 50 characters")
    .regex(
      /^[A-Za-z0-9&.\- ]+$/,
      "Industry contains invalid characters"
    ),

  designation: z
    .string()
    .trim()
    .min(2, "Designation must be at least 2 characters")
    .max(50, "Designation must not exceed 50 characters")
    .regex(
      /^[A-Za-z0-9&.\- ]+$/,
      "Designation contains invalid characters"
    ),

  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must not exceed 100 characters"),

  bio: z
    .string()
    .trim()
    .min(10, "Bio should be at least 10 characters")
    .max(500, "Bio should not exceed 500 characters")
    .refine(
      (text) =>
        text.split(/\s+/).filter(Boolean).length >= 3,
      {
        message: "Bio should contain at least 3 words",
      }
    ),

  linkedinUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      {
        message: "LinkedIn profile must be a valid URL",
      }
    )
    .refine(
      (val) =>
        !val ||
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(val),
      {
        message: "Please enter a valid LinkedIn profile URL",
      }
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;