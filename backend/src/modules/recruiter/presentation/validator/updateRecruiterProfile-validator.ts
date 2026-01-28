import { z } from "zod";

export const UpdateRecruiterProfileSchema = z
  .object({
    fullName: z
      .string("Full name must be a string")
      .min(2, { message: "Full name must be at least 2 characters" })
      .max(100, { message: "Full name must not exceed 100 characters" })
      .optional(),

    profileImage: z
      .string("Profile image must be a string")
      .url({ message: "Profile image must be a valid URL" })
      .optional(),

    companyName: z
      .string("Company name must be a string")
      .min(2, { message: "Company name must be at least 2 characters" })
      .max(100, { message: "Company name must not exceed 100 characters" })
      .optional(),

    companyWebsite: z
      .string("Company website must be a string")
      .url({ message: "Company website must be a valid URL" })
      .optional(),

    companySize: z.coerce
      .number("Company size must be a number")
      .int({ message: "Company size must be an integer" })
      .positive({ message: "Company size must be greater than 0" })
      .optional(),

    industry: z
      .string("Industry must be a string")
      .min(2, { message: "Industry must be at least 2 characters" })
      .max(50, { message: "Industry must not exceed 50 characters" })
      .optional(),

    designation: z
      .string("Designation must be a string")
      .min(2, { message: "Designation must be at least 2 characters" })
      .max(50, { message: "Designation must not exceed 50 characters" })
      .optional(),

    location: z
      .string("Location must be a string")
      .min(2, { message: "Location must be at least 2 characters" })
      .max(100, { message: "Location must not exceed 100 characters" })
      .optional(),

    bio: z
      .string("Bio must be a string")
      .max(500, { message: "Bio must not exceed 500 characters" })
      .optional(),
  })
  .strict()
  .refine(
    data =>
      Object.values(data).some(value => value !== undefined),
    {
      message: "At least one field must be provided to update",
    }
  );
