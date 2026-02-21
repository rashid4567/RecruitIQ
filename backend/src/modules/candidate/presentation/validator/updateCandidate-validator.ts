import { z } from "zod";

export const updateCandidateProfileSchema = z.object({

  fullName: z
    .string()
    .min(1, "Full name cannot be empty")
    .optional(),

  profileImage: z
    .string()
    .url("Invalid profile image URL")
    .optional(),


  currentJob: z
    .string()
    .min(1, "Current job cannot be empty")
    .optional(),

  experienceYears: z
    .coerce
    .number()
    .int("Experience years must be an integer")
    .min(0, "Experience years cannot be negative")
    .optional(),

 
  skills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .optional(),

  educationLevel: z
    .enum(["highschool", "diploma", "bachelor", "master", "phd"])
    .optional(),


  preferredJobLocations: z
    .array(z.string().min(1, "Location cannot be empty"))
    .optional(),

  bio: z
    .string()
    .optional()
    .transform((val) => val === "" ? undefined : val),


  currentJobLocation: z
    .string()
    .optional()
    .transform((val) => val === "" ? undefined : val),

  gender: z
    .enum(["male", "female", "other"])
    .optional(),


  linkedinUrl: z
    .string()
    .optional()
    .transform((val) => val === "" ? undefined : val)
    .refine(
      (val) => !val || /^https?:\/\//.test(val),
      { message: "Invalid LinkedIn URL" }
    ),


  portfolioUrl: z
    .string()
    .optional()
    .transform((val) => val === "" ? undefined : val)
    .refine(
      (val) => !val || /^https?:\/\//.test(val),
      { message: "Invalid portfolio URL" }
    ),
});
 