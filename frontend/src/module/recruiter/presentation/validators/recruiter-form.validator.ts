import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes",
    ),

  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),

  companyWebsite: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Please enter a valid website URL",
    }),

  companySize: z
    .union([z.string(), z.number(), z.undefined()])
    .transform((val) => (val === "" || val == null ? undefined : Number(val)))
    .refine((val) => val !== undefined && val > 0, {
      message: "Company size is required",
    }),

  industry: z.string().trim().min(1, "Industry is required"),

  location: z
    .string()
    .trim()
    .max(100, "Location must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  bio: z
    .string()
    .trim()
    .min(10, "Bio should be at least 10 characters")
    .max(500, "Bio should not exceed 500 characters")
    .refine(
      (text) => text.split(/\s+/).filter(Boolean).length >= 3,
      "Bio should contain at least 3 words",
    ),

  designation: z
    .string()
    .trim()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation must not exceed 100 characters"),

  linkedinUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Please enter a valid LinkedIn URL",
    })
    .refine(
      (val) =>
        !val ||
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(val),
      { message: "Please enter a valid LinkedIn profile URL" },
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
