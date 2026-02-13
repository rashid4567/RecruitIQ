import { z } from "zod";

export const CompleteRecruiterProfileSchema = z
  .object({
    companyName: z
      .string("Company name must be a string")
      .min(2, { message: "Company name must be at least 2 characters" })
      .max(100, { message: "Company name must not exceed 100 characters" }),

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
  .strict();
