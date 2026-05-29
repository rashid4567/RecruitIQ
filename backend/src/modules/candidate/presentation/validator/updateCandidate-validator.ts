import { z } from "zod";

const EDUCATION_LEVELS = [
  "highschool",
  "diploma",
  "bachelor",
  "master",
  "phd",
] as const;

const GENDERS = ["male", "female", "other"] as const;

export const updateCandidateProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name cannot exceed 100 characters")
      .regex(/^[a-zA-Z\s.'-]+$/, "Full name contains invalid characters")
      .optional(),

    profileImage: z
      .string()
      .trim()
      .url("Invalid profile image URL")
      .max(500)
      .optional(),

    currentJob: z
      .string()
      .trim()
      .min(2, "Current job must be at least 2 characters")
      .max(100, "Current job cannot exceed 100 characters")
      .optional(),

    experienceYears: z.coerce
      .number()
      .int("Experience years must be an integer")
      .min(0, "Experience years cannot be negative")
      .max(60, "Experience years is invalid")
      .optional(),

    skills: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Skill cannot be empty")
          .max(50, "Skill is too long"),
      )
      .max(50, "Maximum 50 skills allowed")
      .optional(),

    educationLevel: z.enum(EDUCATION_LEVELS).optional(),

    preferredJobLocations: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Location cannot be empty")
          .max(100, "Location is too long"),
      )
      .max(20, "Maximum 20 locations allowed")
      .optional(),

    bio: z
      .string()
      .trim()
      .max(2000, "Bio cannot exceed 2000 characters")
      .optional()
      .transform((val) => (val === "" ? undefined : val)),

    currentJobLocation: z
      .string()
      .trim()
      .max(100, "Location is too long")
      .optional()
      .transform((val) => (val === "" ? undefined : val)),

    gender: z.enum(GENDERS).optional(),

    linkedinUrl: z
      .string()
      .trim()
      .url("Invalid LinkedIn URL")
      .max(500)
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val)),

    portfolioUrl: z
      .string()
      .trim()
      .url("Invalid portfolio URL")
      .max(500)
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val)),
  })
  .superRefine((data, ctx) => {
    if (data.skills) {
      const uniqueSkills = new Set(
        data.skills.map((skill) => skill.toLowerCase()),
      );

      if (uniqueSkills.size !== data.skills.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["skills"],
          message: "Duplicate skills are not allowed",
        });
      }
    }

    if (data.preferredJobLocations) {
      const uniqueLocations = new Set(
        data.preferredJobLocations.map((location) => location.toLowerCase()),
      );

      if (uniqueLocations.size !== data.preferredJobLocations.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["preferredJobLocations"],
          message: "Duplicate locations are not allowed",
        });
      }
    }
  });

export type UpdateCandidateProfileDTO = z.infer<
  typeof updateCandidateProfileSchema
>;
