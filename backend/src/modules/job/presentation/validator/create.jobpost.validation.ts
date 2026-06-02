import { z } from "zod";

const JOB_TYPES = ["full-time", "part-time", "contract", "internship"] as const;

export const CreateJobSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Job title must be at least 3 characters")
      .max(150, "Job title cannot exceed 150 characters"),

    description: z
      .string()
      .trim()
      .min(20, "Job description must be at least 20 characters")
      .max(10000, "Job description is too long"),

    responsibilities: z
      .array(
        z.string().trim().min(1, "Responsibility cannot be empty").max(500),
      )
      .max(50)
      .optional(),

    requirements: z
      .array(z.string().trim().min(1, "Requirement cannot be empty").max(500))
      .max(50)
      .optional(),

    requiredSkills: z
      .array(z.string().trim().min(1, "Skill cannot be empty").max(50))
      .min(1, "At least one required skill is needed")
      .max(50),

    preferredSkills: z.array(z.string().trim().min(1).max(50)).optional(),

    experienceMin: z.coerce
      .number()
      .int()
      .min(0, "Minimum experience cannot be negative")
      .max(60),

    experienceMax: z.coerce
      .number()
      .int()
      .min(0, "Maximum experience cannot be negative")
      .max(60),

    location: z.object({
      city: z.string().trim().min(1, "City is required"),

      state: z.string().trim().min(1, "State is required"),

      country: z.string().trim().min(1, "Country is required"),
    }),

    isRemote: z.boolean().optional(),

    jobType: z.enum(JOB_TYPES),

    salary: z.object({
      min: z.coerce.number().min(0, "Minimum salary cannot be negative"),

      max: z.coerce.number().min(0, "Maximum salary cannot be negative"),

      currency: z.string().trim().min(1, "Currency is required"),
    }),

    department: z
      .string()
      .trim()
      .min(2, "Department is required")
      .max(100)
      .optional(),

    positions: z.coerce
      .number()
      .int()
      .positive("Positions must be greater than 0"),

    externalLink: z
      .string()
      .trim()
      .url("External link must be a valid URL")
      .optional(),

    expiresAt: z.coerce
      .date({
        message: "Invalid expiry date",
      })
      .optional(),
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

    if (data.expiresAt && data.expiresAt <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiresAt"],
        message: "Expiry date must be in the future",
      });
    }

    const uniqueSkills = new Set(
      data.requiredSkills.map((s) => s.toLowerCase()),
    );

    if (uniqueSkills.size !== data.requiredSkills.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requiredSkills"],
        message: "Duplicate required skills are not allowed",
      });
    }
  });

export type CreateJobDTO = z.infer<typeof CreateJobSchema>;
