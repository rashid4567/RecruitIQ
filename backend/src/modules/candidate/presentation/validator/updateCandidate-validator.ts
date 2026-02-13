import { z } from "zod";

export const updateCandidateProfileSchema = z.object({
  fullName: z.string().min(1, "Full name cannot be empty").optional(),

  profileImage: z.string().url().optional(),

  currentJob: z.string().min(1, "Current job cannot be empty").optional(),

  experienceYears: z
    .coerce.number()
    .int("Experience years must be an integer")
    .min(0, "Experience years cannot be negative")
    .optional(),

  skills: z.array(z.string().min(1, "Skill cannot be empty")).optional(),

  educationLevel: z
    .enum(["highschool", "diploma", "bachelor", "master", "phd"])
    .optional(),

  preferredJobLocations: z
    .array(z.string().min(1, "Location cannot be empty"))
    .optional(),

  bio: z.string().min(1, "Bio cannot be empty").optional(),

  currentJobLocation: z.string().min(1).optional(),

  gender: z.enum(["male", "female", "other"]).optional(),

  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional(),

  portfolioUrl: z.string().url("Invalid portfolio URL").optional(),
});
