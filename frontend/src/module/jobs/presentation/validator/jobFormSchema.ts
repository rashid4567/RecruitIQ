
import { z } from "zod";

export const jobFormSchema = z
  .object({
    title: z.string().min(5, "Job title must be at least 5 characters long"),
    department: z.string().min(1, "Please select a department"),
    positions: z.number().min(1, "At least 1 position is required"),
    jobType: z.enum(["full-time", "part-time", "contract", "internship"]),

    location: z.object({
      city: z.string().min(2, "City is required"),
      state: z.string().min(2, "State is required"),
      country: z.string().min(2, "Country is required"),
    }),

    isRemote: z.boolean(),

    description: z
      .string()
      .min(50, "Description must be at least 50 characters"),
    responsibilities: z
      .array(z.string().min(1))
      .min(1, "Add at least one responsibility"),
    requirements: z
      .array(z.string().min(1))
      .min(1, "Add at least one requirement"),

    experienceMin: z.number().min(0),
    experienceMax: z.number().min(0),

    requiredSkills: z
      .array(z.string())
      .min(1, "At least one required skill is needed"),
    preferredSkills: z.array(z.string()),

    salary: z.object({
      currency: z.string(),
      min: z.number().min(0),
      max: z.number().min(0),
    }),

    expiresAt: z.string().min(1, "Application deadline is required"),
    externalLink: z.string().url("Please enter a valid URL").or(z.literal("")),
  })
  .refine((data) => data.experienceMin <= data.experienceMax, {
    message: "Minimum experience cannot be greater than maximum",
    path: ["experienceMax"],
  })
  .refine((data) => data.salary.min <= data.salary.max, {
    message: "Minimum salary cannot be greater than maximum",
    path: ["salary.max"],
  });
