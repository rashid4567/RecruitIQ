import { z } from "zod";



const VALID_PLAN_TYPES = ["free", "basic", "pro", "enterprise"] as const;
const VALID_BILLING_CYCLES = ["weekly", "monthly", "yearly"] as const;
const VALID_CURRENCIES = ["INR", "USD", "EUR", "GBP"] as const;



const FeaturesAccessSchema = z.object({
  interviewScheduling: z.boolean(),
  advancedAnalytics: z.boolean(),
  prioritySupport: z.boolean(),
});

const PlanFeatureSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Feature name is required"),
  included: z.boolean(),
});


export const CreatePlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  planType: z.enum(VALID_PLAN_TYPES),

  price: z
    .number()
    .min(0, "Price must be a non-negative number"),

  currency: z.enum(VALID_CURRENCIES),

  billingCycle: z.enum(VALID_BILLING_CYCLES),

  billingInterval: z
    .number()
    .int("Billing interval must be an integer")
    .min(1, "Billing interval must be at least 1"),

  jobPostsPerMonth: z
    .number()
    .int("Job posts must be an integer")
    .min(-1, "Must be >= -1 (-1 means unlimited)"),

  screeningCredits: z
    .number()
    .int("Screening credits must be an integer")
    .min(-1, "Must be >= -1 (-1 means unlimited)"),

  featuresAccess: FeaturesAccessSchema,

  features: z
    .array(PlanFeatureSchema)
    .min(1, "At least one feature is required"),

 isPopular: z.boolean().default(false),
sortOrder: z.number().default(0),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  razorpayPlanId: z.string().optional(),
});



export const UpdatePlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .optional(),

  price: z
    .number()
    .min(0, "Price must be a non-negative number")
    .optional(),

  currency: z.enum(VALID_CURRENCIES).optional(),

  billingCycle: z.enum(VALID_BILLING_CYCLES).optional(),

  billingInterval: z
    .number()
    .int("Billing interval must be an integer")
    .min(1, "Billing interval must be at least 1")
    .optional(),

  jobPostsPerMonth: z
    .number()
    .int("Job posts must be an integer")
    .min(-1)
    .optional(),

  screeningCredits: z
    .number()
    .int("Screening credits must be an integer")
    .min(-1)
    .optional(),

  featuresAccess: FeaturesAccessSchema.partial().optional(),

  features: z
    .array(PlanFeatureSchema)
    .min(1, "At least one feature is required")
    .optional(),

  isPopular: z.boolean().optional(),

  sortOrder: z
    .number()
    .int("Sort order must be an integer")
    .min(0)
    .optional(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  razorpayPlanId: z.string().optional(),
});

// ── TYPES ─────────────────────────────────────────

export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;
export type UpdatePlanInput = z.infer<typeof UpdatePlanSchema>;