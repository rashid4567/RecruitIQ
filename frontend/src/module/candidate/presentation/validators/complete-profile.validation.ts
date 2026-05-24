import z from "zod";

export const candidateProfileSchema = z.object({
  currentJob: z
    .string()
    .min(1, "Current / most recent job title is required.")
    .max(100, "Job title must be under 100 characters."),

  experienceYears: z
    .string()
    .min(1, "Please select your years of experience."),

  educationLevel: z
    .string()
    .min(1, "Please select your highest education level."),

  skills: z.array(z.string()).min(1, "Please add at least one skill."),

  preferredJobLocations: z
    .string()
    .min(1, "Please enter at least one preferred location.")
    .max(200, "Locations must be under 200 characters."),

  bio: z
    .string()
    .min(20, "Bio must be at least 20 characters.")
    .max(1000, "Bio must be under 1000 characters."),

  linkedinUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(val),
      {
        message:
          "Enter a valid LinkedIn URL (e.g. https://linkedin.com/in/yourname).",
      }
    ),
});
