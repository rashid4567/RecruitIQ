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
  name: z
    .string()
    .trim()
    .min(1, "Feature name is required")
    .min(2, "Feature name must be at least 2 characters")
    .max(100, "Feature name cannot exceed 100 characters")
    .regex(/^[a-zA-Z0-9\s\-&()]+$/, "Feature name contains invalid characters"),

  included: z.boolean(),
});

const BasePlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Plan name is required")
    .min(3, "Plan name must be at least 3 characters")
    .max(50, "Plan name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-]+$/,
      "Plan name can only contain letters, numbers, spaces and hyphens",
    ),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description cannot exceed 300 characters"),

  planType: z.enum(VALID_PLAN_TYPES),

  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(100000, "Price cannot exceed ₹100,000"),

  currency: z.enum(VALID_CURRENCIES),

  billingCycle: z.enum(VALID_BILLING_CYCLES),

  billingInterval: z
    .number()
    .int("Billing interval must be a whole number")
    .min(1, "Billing interval must be at least 1")
    .max(12, "Billing interval cannot exceed 12"),
  resumeDownloadedCount: z.number().int().min(-1, "Use -1 for unlimited").max(100000),
  jobPostsPerMonth: z
    .number()
    .int("Job posts per month must be a whole number")
    .min(-1, "Use -1 for unlimited")
    .max(10000, "Job posts per month cannot exceed 10,000"),

  jobPostActiveDays: z
    .number()
    .int("Job post active days must be a whole number")
    .min(1, "Job post active days must be at least 1 day")
    .max(365, "Job post active days cannot exceed 365 days"),

  screeningCredits: z
    .number()
    .int("Screening credits must be a whole number")
    .min(-1, "Use -1 for unlimited")
    .max(100000, "Screening credits cannot exceed 100,000"),

  resumeParsesPerMonth: z
    .number()
    .int("Resume parses must be a whole number")
    .min(-1, "Use -1 for unlimited")
    .max(100000, "Resume parses cannot exceed 100,000"),

  aiScoreCredits: z
    .number()
    .int("AI score credits must be a whole number")
    .min(-1, "Use -1 for unlimited")
    .max(100000, "AI score credits cannot exceed 100,000"),

  featuresAccess: FeaturesAccessSchema,

  features: z
    .array(PlanFeatureSchema)
    .min(1, "At least one feature is required")
    .max(25, "Maximum 25 features allowed"),

  isPopular: z.boolean().default(false),

  sortOrder: z
    .number()
    .int("Sort order must be a whole number")
    .min(1, "Sort order must be at least 1")
    .max(1000, "Sort order cannot exceed 1000")
    .default(1),

  razorpayPlanId: z
    .string()
    .trim()
    .regex(/^plan_[a-zA-Z0-9]+$/, "Invalid Razorpay Plan ID")
    .optional(),
});

export const CreatePlanSchema = BasePlanSchema.superRefine((data, ctx) => {
  const featureNames = data.features.map((feature) =>
    feature.name.toLowerCase().trim(),
  );

  if (new Set(featureNames).size !== featureNames.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["features"],
      message: "Duplicate feature names are not allowed",
    });
  }

  if (data.planType === "free" && data.price !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["price"],
      message: "Free plans must have a price of 0",
    });
  }

  if (data.planType !== "free" && data.price <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["price"],
      message: "Paid plans must have a price greater than 0",
    });
  }

  if (data.planType === "free" && data.razorpayPlanId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["razorpayPlanId"],
      message: "Free plans cannot have a Razorpay Plan ID",
    });
  }

  if (data.planType !== "free" && !data.razorpayPlanId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["razorpayPlanId"],
      message: "Razorpay Plan ID is required for paid plans",
    });
  }

  const enabledFeatures = Object.values(data.featuresAccess).filter(Boolean);

  if (data.planType !== "free" && enabledFeatures.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["featuresAccess"],
      message: "Paid plans must enable at least one feature",
    });
  }
});

export const UpdatePlanSchema = z
  .object({
    name: BasePlanSchema.shape.name.optional(),
    description: BasePlanSchema.shape.description.optional(),
    price: BasePlanSchema.shape.price.optional(),
    currency: BasePlanSchema.shape.currency.optional(),
    billingCycle: BasePlanSchema.shape.billingCycle.optional(),
    billingInterval: BasePlanSchema.shape.billingInterval.optional(),

    jobPostsPerMonth: BasePlanSchema.shape.jobPostsPerMonth.optional(),

    jobPostActiveDays: BasePlanSchema.shape.jobPostActiveDays.optional(),

    screeningCredits: BasePlanSchema.shape.screeningCredits.optional(),

    resumeParsesPerMonth: BasePlanSchema.shape.resumeParsesPerMonth.optional(),

    aiScoreCredits: BasePlanSchema.shape.aiScoreCredits.optional(),

    featuresAccess: FeaturesAccessSchema.partial().optional(),

    features: z.array(PlanFeatureSchema).max(25).optional(),

    isPopular: z.boolean().optional(),

    sortOrder: BasePlanSchema.shape.sortOrder.optional(),

    razorpayPlanId: BasePlanSchema.shape.razorpayPlanId.optional(),
  })
  .strict();

export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;
export type UpdatePlanInput = z.infer<typeof UpdatePlanSchema>;
