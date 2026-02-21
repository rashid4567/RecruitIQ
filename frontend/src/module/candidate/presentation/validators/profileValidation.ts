import { z } from "zod";

const optionalString = (schema: z.ZodString) =>
  z.union([schema, z.literal("")]).transform((v) => v || undefined);

export const GenderEnum = z.enum(["male", "female", "other"]);

export const genderSchema = z
  .union([GenderEnum, z.literal("")])
  .transform((v) => v || undefined)
  .optional();

export const fullNameSchema = z
  .string()
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must be less than 100 characters");

export const emailSchema = optionalString(
  z.string().email("Please enter a valid email address"),
);

export const experienceYearsSchema = z
  .union([z.coerce.number(), z.literal("")])
  .transform((v) => (v === "" ? undefined : v))
  .refine(
    (val) => val === undefined || !Number.isNaN(val),
    "Experience must be a number",
  )
  .refine(
    (val) => val === undefined || val >= 0,
    "Experience cannot be negative",
  )
  .refine(
    (val) => val === undefined || val <= 50,
    "Experience cannot exceed 50 years",
  )
  .optional();

export const linkedinSchema = optionalString(
  z
    .string()
    .url("Please enter a valid URL")
    .regex(
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
      "Please enter a valid LinkedIn URL",
    ),
);

export const portfolioSchema = optionalString(
  z.string().url("Please enter a valid URL"),
);

export const bioSchema = optionalString(
  z.string().max(500, "Bio must be less than 500 characters"),
);

export const currentJobSchema = optionalString(
  z.string().max(100, "Job title must be less than 100 characters"),
);

export const educationSchema = optionalString(
  z.string().max(100, "Education must be less than 100 characters"),
);

export const locationSchema = optionalString(
  z.string().max(100, "Location must be less than 100 characters"),
);

export const skillsSchema = z
  .array(z.string())
  .max(20, "Cannot have more than 20 skills")
  .optional();

export const preferredLocationsSchema = z
  .array(z.string().max(100))
  .max(10, "Cannot have more than 10 preferred locations")
  .optional();

export const profileFormSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,

  currentJob: currentJobSchema,
  experienceYears: experienceYearsSchema,
  educationLevel: educationSchema,
  currentJobLocation: locationSchema,

  gender: genderSchema,

  linkedinUrl: linkedinSchema,
  portfolioUrl: portfolioSchema,
  bio: bioSchema,

  skills: skillsSchema,
  preferredJobLocations: preferredLocationsSchema,

    profileImage: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export function validateProfileForm(data: unknown) {
  return profileFormSchema.safeParse(data);
}

export function validateProfileField(
  field: keyof ProfileFormData,
  value: unknown,
): string {
  const fieldSchema = profileFormSchema.shape[field];

  const result = fieldSchema.safeParse(value);

  if (!result.success) {
    return result.error.issues[0]?.message || "Invalid value";
  }

  return "";
}
