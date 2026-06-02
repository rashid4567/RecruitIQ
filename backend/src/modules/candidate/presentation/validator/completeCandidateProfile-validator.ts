import { z } from "zod";

const EDUCATION_LEVELS = [
  "highschool",
  "diploma",
  "bachelor",
  "master",
  "phd",
] as const;

const GENDERS = ["male", "female", "other"] as const;

export const completeCandidateProfileSchema = z
  .object({
    currentJob: z
      .string()
      .trim()
      .min(2, "Current job is required")
      .max(100, "Current job cannot exceed 100 characters")
      .regex(
        /^[A-Za-z0-9&.,()\- ]+$/,
        "Current job contains invalid characters",
      ),

    experienceYears: z.coerce
      .number()
      .int("Experience years must be an integer")
      .min(0, "Experience cannot be negative")
      .max(60, "Experience years is invalid")
      .optional(),

    skills: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Skill cannot be empty")
          .max(50, "Skill is too long")
          .regex(/^[A-Za-z0-9#+.\- ]+$/, "Invalid skill name"),
      )
      .min(1, "At least one skill is required")
      .max(50, "Maximum 50 skills allowed"),

    educationLevel: z.enum(EDUCATION_LEVELS),

    preferredJobLocations: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Location cannot be empty")
          .max(100, "Location is too long")
          .regex(/^[A-Za-z0-9,.\- ]+$/, "Location contains invalid characters"),
      )
      .min(1, "At least one location is required")
      .max(20, "Maximum 20 locations allowed"),

    bio: z
      .string()
      .trim()
      .min(20, "Bio must be at least 20 characters")
      .max(2000, "Bio cannot exceed 2000 characters")
      .refine((text) => text.split(/\s+/).filter(Boolean).length >= 5, {
        message: "Bio should contain at least 5 words",
      }),

    currentJobLocation: z
      .string()
      .trim()
      .min(2, "Current location is required")
      .max(100, "Location cannot exceed 100 characters")
      .regex(/^[A-Za-z0-9,.\- ]+$/, "Location contains invalid characters")
      .optional(),

    gender: z.enum(GENDERS).optional(),

    linkedinUrl: z
      .string()
      .trim()
      .url("Invalid LinkedIn profile URL")
      .max(500, "LinkedIn URL is too long")
      .refine(
        (url) =>
          /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(
            url,
          ),
        {
          message: "Please enter a valid LinkedIn profile URL",
        },
      )
      .optional(),

    portfolioUrl: z
      .string()
      .trim()
      .url("Invalid portfolio URL")
      .max(500, "Portfolio URL is too long")
      .optional(),
  })
  .superRefine((data, ctx) => {
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
  });

export type CompleteCandidateProfileDTO = z.infer<
  typeof completeCandidateProfileSchema
>;
