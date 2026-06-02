import { z } from "zod";

export const UserRoleSchema = z.enum([
  "candidate",
  "recruiter",
]);

export const SignUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters")
      .regex(
        /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/,
        "Please enter a valid full name"
      ),

    email: z
      .string()
      .trim()
      .email("Valid email is required"),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      )
      .regex(
        /[A-Z]/,
        "Password must contain an uppercase letter"
      )
      .regex(
        /[a-z]/,
        "Password must contain a lowercase letter"
      )
      .regex(
        /\d/,
        "Password must contain a number"
      )
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain a special character"
      ),

    confirmPassword: z.string(),

    role: UserRoleSchema,

    termsAccepted: z
      .boolean()
      .refine(
        (value) => value === true,
        {
          message:
            "You must accept the terms and conditions",
        }
      ),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type SignUpSchemaType =
  z.infer<typeof SignUpSchema>;