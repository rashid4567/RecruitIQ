import { z } from "zod";

export const completeCandidateProfileSchema = z.object({

  currentJob: z.string().min(1, "Current job is required"),

  experienceYears: z
    .number()
    .int("Experience years must be an integer")
    .min(0, "Experience years cannot be negative")
    .optional(),


  skills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "At least one skill is required"),

  educationLevel: z.enum([
    "highschool",
    "diploma",
    "Bachelor",
    "master",
    "phd",
  ]),

  preferredJobLocations: z
    .array(z.string().min(1, "Location cannot be empty"))
    .min(1, "At least one location is required"),

  bio: z.string().min(1, "Bio is required"),

  currentJobLocation: z.string().min(1).optional(),

  gender: z.enum(["Male", "female", "other"]).optional(),

  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional(),

  portfolioUrl: z.string().url("Invalid portfolio URL").optional(),
});
