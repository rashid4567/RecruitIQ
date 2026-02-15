import { z } from "zod";

export const updateCandidateProfileSchema = z.object({
  // ---------- USER ----------
  fullName: z
    .string()
    .min(1, "Full name cannot be empty")
    .optional(),

  profileImage: z
    .string()
    .url("Invalid profile image URL")
    .optional(),

  // ---------- CANDIDATE ----------
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

  // ⭐ allow empty array
  skills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .optional(),

  educationLevel: z
    .enum(["highschool", "diploma", "bachelor", "master", "phd"])
    .optional(),

  // ⭐ allow empty array
  preferredJobLocations: z
    .array(z.string().min(1, "Location cannot be empty"))
    .optional(),

  bio: z
    .string()
    .optional()
    .transform((val) => val === "" ? undefined : val),

  // ⭐ empty string → undefined
  currentJobLocation: z
    .string()
    .optional()
    .transform((val) => val === "" ? undefined : val),

  gender: z
    .enum(["male", "female", "other"])
    .optional(),

  // ⭐ empty string allowed + must be valid URL if present
  linkedinUrl: z
    .string()
    .optional()
    .transform((val) => val === "" ? undefined : val)
    .refine(
      (val) => !val || /^https?:\/\//.test(val),
      { message: "Invalid LinkedIn URL" }
    ),

  // ⭐ empty string allowed + must be valid URL if present
  portfolioUrl: z
    .string()
    .optional()
    .transform((val) => val === "" ? undefined : val)
    .refine(
      (val) => !val || /^https?:\/\//.test(val),
      { message: "Invalid portfolio URL" }
    ),
});
 