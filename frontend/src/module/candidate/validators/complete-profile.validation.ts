import { z } from "zod";

const EDUCATION_LEVELS = [
  "highschool",
  "diploma",
  "bachelor",
  "master",
  "phd",
] as const;

const GENDERS = [
  "male",
  "female",
  "other",
] as const;

export const candidateProfileSchema = z.object({
  currentJob: z
    .string()
    .trim()
    .min(2, "Current job is required")
    .max(100, "Current job cannot exceed 100 characters"),

  experienceYears: z
    .string()
    .min(1, "Please select your years of experience"),

  educationLevel: z.enum(EDUCATION_LEVELS, {
    message: "Please select your highest education level",
  }),

  skills: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Skill cannot be empty")
        .max(50, "Skill is too long")
    )
    .min(1, "Please add at least one skill")
    .max(50, "Maximum 50 skills allowed"),

  preferredJobLocations: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Location cannot be empty")
        .max(100, "Location is too long")
    )
    .min(1, "Please add at least one preferred location"),

  bio: z
    .string()
    .trim()
    .min(20, "Bio must be at least 20 characters")
    .max(2000, "Bio must not exceed 2000 characters"),

  currentJobLocation: z
    .string()
    .trim()
    .max(100)
    .optional(),

  gender: z
    .enum(GENDERS)
    .optional(),

  linkedinUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val ||
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(
          val
        ),
      {
        message:
          "Please enter a valid LinkedIn profile URL",
      }
    ),

  portfolioUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val ||
        z.string().url().safeParse(val).success,
      {
        message:
          "Please enter a valid portfolio URL",
      }
    ),
});

export type CandidateProfileFormData =
  z.infer<typeof candidateProfileSchema>;