import { z } from "zod";



const optionalUrl = (message: string) =>
  z
    .union([
      z.string().trim().url({ message }),
      z.literal(""),
    ])
    .optional()
    .transform((val) => (val === "" ? undefined : val));

export const UpdateRecruiterProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters")
      .regex(
        /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/,
        "Please enter a valid full name"
      )
      .optional(),

    profileImage: optionalUrl(
      "Profile image must be a valid URL"
    ),

    companyName: z
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must not exceed 100 characters")
      .regex(
        /^[A-Za-z0-9&.,'()\- ]+$/,
        "Company name contains invalid characters"
      )
      .optional(),

    companyWebsite: optionalUrl(
      "Company website must be a valid URL"
    ),

    companySize: z.coerce
      .number()
      .int("Company size must be an integer")
      .positive("Company size must be greater than 0")
      .max(1000000, "Company size is too large")
      .optional(),

    industry: z
      .string()
      .trim()
      .min(2, "Industry must be at least 2 characters")
      .max(50, "Industry must not exceed 50 characters")
      .regex(
  /^[A-Za-z0-9&.\- ]+$/,
  "Contains invalid characters"
)
      .optional(),

    designation: z
      .string()
      .trim()
      .min(2, "Designation must be at least 2 characters")
      .max(50, "Designation must not exceed 50 characters")
      .regex(
  /^[A-Za-z0-9&.\- ]+$/,
  "Contains invalid characters"
)
      .optional(),

    location: z
      .string()
      .trim()
      .min(2, "Location must be at least 2 characters")
      .max(100, "Location must not exceed 100 characters")
      .optional(),

    bio: z
      .string()
      .trim()
      .max(500, "Bio must not exceed 500 characters")
      .optional(),

    linkedinUrl: optionalUrl(
      "LinkedIn profile must be a valid URL"
    ).refine(
      (url) =>
        !url ||
        url.includes("linkedin.com"),
      {
        message:
          "Please provide a valid LinkedIn profile URL",
      }
    ),
  })
  .strict()
  .refine(
    (data) =>
      Object.values(data).some(
        (value) => value !== undefined
      ),
    {
      message:
        "At least one field must be provided to update",
    }
  );