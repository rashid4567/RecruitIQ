import { z } from "zod";
import { jobFormSchema } from "@/module/jobs/validator/jobFormSchema";
import type { JobFormData } from "@/module/recruiter/types/jobForm.types";

function buildStepSchema(step: number): z.ZodTypeAny | null {
  if (step === 1) {
    return jobFormSchema.pick({
      title: true,
      department: true,
      positions: true,
      location: true,
      jobType: true,
      isRemote: true,
    });
  }

  if (step === 2) {
    return jobFormSchema.pick({
      description: true,
      responsibilities: true,
      requirements: true,
    });
  }

  if (step === 3) {
    return jobFormSchema
      .pick({
        requiredSkills: true,
        preferredSkills: true,
        experienceMin: true,
        experienceMax: true,
      })
      .superRefine((data, ctx) => {
        if (
          data.experienceMax > 0 &&
          data.experienceMin > data.experienceMax
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["experienceMax"],
            message:
              "Maximum experience must be greater than minimum experience",
          });
        }

        const unique = new Set(
          data.requiredSkills.map((s: string) => s.toLowerCase()),
        );
        if (unique.size !== data.requiredSkills.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["requiredSkills"],
            message: "Duplicate skills are not allowed",
          });
        }
      });
  }

  if (step === 4) {
    return jobFormSchema
      .pick({
        salary: true,
        expiresAt: true,
        externalLink: true,
      })
      .superRefine((data, ctx) => {
        if (
          data.salary.min > 0 &&
          data.salary.max > 0 &&
          data.salary.min > data.salary.max
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["salary", "max"],
            message: "Maximum salary must be greater than minimum salary",
          });
        }

        if (data.expiresAt) {
          const d = new Date(data.expiresAt);
          if (isNaN(d.getTime())) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["expiresAt"],
              message: "Please select a valid expiry date",
            });
          } else if (d <= new Date()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["expiresAt"],
              message: "Expiry date must be in the future",
            });
          }
        }
      });
  }

  return null;
}

export function getStepErrors(
  step: number,
  formData: JobFormData,
): Record<string, string> {
  const schema = buildStepSchema(step);
  if (!schema) return {};

  const result = schema.safeParse(formData);
  if (result.success) return {};

  const errs: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (!errs[path]) errs[path] = issue.message;
  }
  return errs;
}

export function isStepValid(step: number, formData: JobFormData): boolean {
  return Object.keys(getStepErrors(step, formData)).length === 0;
}