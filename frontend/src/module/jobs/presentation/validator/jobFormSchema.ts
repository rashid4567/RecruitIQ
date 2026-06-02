import { z } from "zod";

const JOB_TYPES = ["full-time", "part-time", "contract", "internship"] as const;

export const jobFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Job title must be at least 3 characters long")
      .max(150, "Job title cannot exceed 150 characters"),

    department: z
      .string()
      .trim()
      .min(2, "Department is required")
      .max(100, "Department cannot exceed 100 characters"),

    positions: z.number().int().positive("At least 1 position is required"),

    jobType: z.enum(JOB_TYPES),

    location: z.object({
      city: z.string().trim().min(2, "City is required").max(100),

      state: z.string().trim().min(2, "State is required").max(100),

      country: z.string().trim().min(2, "Country is required").max(100),
    }),

    isRemote: z.boolean(),

    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters")
      .max(10000, "Description is too long"),

    responsibilities: z
      .array(
        z.string().trim().min(1, "Responsibility cannot be empty").max(500),
      )
      .min(1, "Add at least one responsibility")
      .max(50),

    requirements: z
      .array(z.string().trim().min(1, "Requirement cannot be empty").max(500))
      .min(1, "Add at least one requirement")
      .max(50),

    experienceMin: z
      .number()
      .int()
      .min(0, "Experience cannot be negative")
      .max(60),

    experienceMax: z
      .number()
      .int()
      .min(0, "Experience cannot be negative")
      .max(60),

    requiredSkills: z
      .array(z.string().trim().min(1).max(50))
      .min(1, "At least one required skill is needed")
      .max(50),

    preferredSkills: z.array(z.string().trim().min(1).max(50)).max(50),

    salary: z.object({
      currency: z.string().trim().min(1, "Currency is required"),

      min: z.number().min(0, "Minimum salary cannot be negative"),

      max: z.number().min(0, "Maximum salary cannot be negative"),
    }),

    expiresAt: z.string().min(1, "Application deadline is required"),

    externalLink: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine((val) => !val || z.string().url().safeParse(val).success, {
        message: "Please enter a valid URL",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.experienceMin > data.experienceMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["experienceMax"],
        message: "Maximum experience must be greater than minimum experience",
      });
    }

    if (data.salary.min > data.salary.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["salary", "max"],
        message: "Maximum salary must be greater than minimum salary",
      });
    }

    const expiryDate = new Date(data.expiresAt);

    if (Number.isNaN(expiryDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiresAt"],
        message: "Please select a valid expiry date",
      });
    }

    if (expiryDate <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiresAt"],
        message: "Expiry date must be in the future",
      });
    }

    const uniqueRequiredSkills = new Set(
      data.requiredSkills.map((skill) => skill.toLowerCase()),
    );

    if (uniqueRequiredSkills.size !== data.requiredSkills.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requiredSkills"],
        message: "Duplicate skills are not allowed",
      });
    }
  });

export type JobFormData = z.infer<typeof jobFormSchema>;
