import { z } from "zod";

const VALID_PLAN_TYPES = ["free", "basic", "pro", "enterprise"] as const;

const VALID_BILLING_CYCLES = ["weekly", "monthly", "yearly"] as const;

const VALID_CURRENCIES = ["INR", "USD", "EUR", "GBP"] as const;

const FeaturesAccessSchema = z.object({
  interviewScheduling: z.boolean(),

  advancedAnalytics: z.boolean(),

  prioritySupport: z.boolean(),

  resumeParsing: z.boolean(),

  aiResumeScoring: z.boolean(),

  candidateShortlisting: z.boolean(),

  exportReports: z.boolean(),
});

const PlanFeatureSchema = z.object({
  name: z.string().trim().min(1, "Feature name is required"),

  included: z.boolean(),
});

export const CreatePlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  planType: z.enum(VALID_PLAN_TYPES),

  price: z.number().min(0, "Price must be non negative"),

  currency: z.enum(VALID_CURRENCIES),

  billingCycle: z.enum(VALID_BILLING_CYCLES),

  billingInterval: z
    .number()
    .int("Billing interval must be integer")
    .min(1, "Billing interval must be at least 1"),

  jobPostsPerMonth: z
    .number()
    .int("Job posts must be integer")
    .min(-1, "Use -1 for unlimited"),

  screeningCredits: z
    .number()
    .int("Screening credits must be integer")
    .min(-1, "Use -1 for unlimited"),

  resumeParsesPerMonth: z
    .number()
    .int("Resume parses must be integer")
    .min(-1, "Use -1 for unlimited"),

  aiScoreCredits: z
    .number()
    .int("AI score credits must be integer")
    .min(-1, "Use -1 for unlimited"),

  featuresAccess: FeaturesAccessSchema,

  features: z.array(PlanFeatureSchema).min(1, "At least one feature required"),

  isPopular: z.boolean().default(false),

  sortOrder: z.number().default(0),

  description: z.string().max(500, "Description too long").optional(),

  razorpayPlanId: z.string().optional(),
});

export const UpdatePlanSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),

  price: z.number().min(0).optional(),

  currency: z.enum(VALID_CURRENCIES).optional(),

  billingCycle: z.enum(VALID_BILLING_CYCLES).optional(),

  billingInterval: z.number().int().min(1).optional(),

  jobPostsPerMonth: z.number().int().min(-1).optional(),

  screeningCredits: z.number().int().min(-1).optional(),

  resumeParsesPerMonth: z.number().int().min(-1).optional(),

  aiScoreCredits: z.number().int().min(-1).optional(),

  featuresAccess: FeaturesAccessSchema.partial().optional(),

  features: z.array(PlanFeatureSchema).optional(),

  isPopular: z.boolean().optional(),

  sortOrder: z.number().int().min(0).optional(),

  description: z.string().max(500).optional(),

  razorpayPlanId: z.string().optional(),
});

export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;

export type UpdatePlanInput = z.infer<typeof UpdatePlanSchema>;
