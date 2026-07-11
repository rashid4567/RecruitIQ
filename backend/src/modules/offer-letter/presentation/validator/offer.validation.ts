import { z } from "zod";

import {
  Currency,
  EmploymentType,
} from "../../domain/entity/offer-letter.entity";

export const createOfferSchema = z
  .object({
    applicationId: z.string().trim().min(1, "Application ID is required."),

    annualCTC: z.number().positive("Annual CTC must be greater than 0."),

    currency: z.enum(Currency),

    employmentType: z.enum(EmploymentType),

    department: z
      .string()
      .trim()
      .max(100, "Department cannot exceed 100 characters.")
      .optional(),

    workLocation: z
      .string()
      .trim()
      .min(2, "Work location is required.")
      .max(150, "Work location cannot exceed 150 characters."),

    joiningDate: z.coerce.date(),

    probationPeriod: z
      .string()
      .trim()
      .max(100, "Probation period cannot exceed 100 characters.")
      .optional(),

    benefits: z
      .array(z.string().trim().min(1, "Benefit cannot be empty."))
      .default([]),

    notes: z
      .string()
      .trim()
      .max(5000, "Notes cannot exceed 5000 characters.")
      .optional(),

    expiryDate: z.coerce.date(),
  })
  .superRefine((data, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const joiningDate = new Date(data.joiningDate);
    joiningDate.setHours(0, 0, 0, 0);

    const expiryDate = new Date(data.expiryDate);
    expiryDate.setHours(0, 0, 0, 0);

    if (joiningDate < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["joiningDate"],
        message: "Joining date cannot be in the past.",
      });
    }

    if (expiryDate <= today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiryDate"],
        message: "Expiry date must be in the future.",
      });
    }

    if (expiryDate >= joiningDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiryDate"],
        message: "Expiry date must be before the joining date.",
      });
    }
  });

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
