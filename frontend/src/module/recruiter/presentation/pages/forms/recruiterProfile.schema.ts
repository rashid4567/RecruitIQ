import z from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes",
    ),

  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),

  companyWebsite: z
    .string()
    .url("Please enter a valid website URL (e.g., https://example.com)")
    .optional()
    .or(z.literal("")),

  companySize: z.coerce.number().min(1, "Company size is required"),

  industry: z.string().min(1, "Industry is required"),

  location: z
    .string()
    .max(100, "Location must not exceed 100 characters")
    .optional(),

  bio: z
    .string()
    .min(10, "Bio should be at least 10 characters")
    .max(500, "Bio should not exceed 500 characters")
    .refine(
      (text) =>
        text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length >= 3,
      "Bio should contain at least 3 words",
    ),

  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation must not exceed 100 characters"),

  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .regex(
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
      "Please enter a valid LinkedIn profile URL (e.g., linkedin.com/in/username)",
    )
    .optional()
    .or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
