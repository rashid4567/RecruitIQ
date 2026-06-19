import { z } from "zod";

const JOB_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
] as const;

export const UpdateJobSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(3)
      .max(100)
      .optional(),

    title: z
      .string()
      .trim()
      .min(3)
      .max(150)
      .optional(),

    description: z
      .string()
      .trim()
      .min(20)
      .max(10000)
      .optional(),

    responsibilities: z
      .array(
        z.string().trim().min(1).max(500),
      )
      .max(50)
      .optional(),

    requirements: z
      .array(
        z.string().trim().min(1).max(500),
      )
      .max(50)
      .optional(),

    requiredSkills: z
      .array(
        z.string().trim().min(1).max(50),
      )
      .max(50)
      .optional(),

    preferredSkills: z
      .array(
        z.string().trim().min(1).max(50),
      )
      .max(50)
      .optional(),

    experienceMin: z.coerce
      .number()
      .int()
      .min(0)
      .max(60)
      .optional(),

    experienceMax: z.coerce
      .number()
      .int()
      .min(0)
      .max(60)
      .optional(),

    location: z
      .object({
        city: z.string().trim().min(1),
        state: z.string().trim().min(1),
        country: z.string().trim().min(1),
      })
      .optional(),

    isRemote: z.boolean().optional(),

    jobType: z.enum(JOB_TYPES).optional(),

    salary: z
      .object({
        min: z.coerce.number().min(0),
        max: z.coerce.number().min(0),
        currency: z.string().trim().min(1),
      })
      .optional(),

    department: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    positions: z.coerce
      .number()
      .int()
      .positive()
      .optional(),

    externalLink: z
      .string()
      .trim()
      .url()
      .optional(),

    expiresAt: z.coerce.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.experienceMin !== undefined &&
      data.experienceMax !== undefined &&
      data.experienceMin > data.experienceMax
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["experienceMax"],
        message:
          "Maximum experience must be greater than minimum experience",
      });
    }

    if (
      data.salary &&
      data.salary.min > data.salary.max
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["salary", "max"],
        message:
          "Maximum salary must be greater than minimum salary",
      });
    }

    if (
      data.expiresAt &&
      data.expiresAt <= new Date()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiresAt"],
        message:
          "Expiry date must be in the future",
      });
    }

    if (data.requiredSkills) {
      const uniqueSkills = new Set(
        data.requiredSkills.map((s) =>
          s.toLowerCase(),
        ),
      );

      if (
        uniqueSkills.size !==
        data.requiredSkills.length
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["requiredSkills"],
          message:
            "Duplicate required skills are not allowed",
        });
      }
    }
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "At least one field must be provided for update",
    },
  );

export type UpdateJobDTO = z.infer<
  typeof UpdateJobSchema
>;