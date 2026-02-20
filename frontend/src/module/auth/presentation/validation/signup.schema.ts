import { z } from "zod";

export const UserRoleSchema = z.enum(["candidate", "recruiter"]);


export const SignUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required"),

    email: z
      .string()
      .email("Valid email is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain uppercase letter")
      .regex(/[a-z]/, "Password must contain lowercase letter")
      .regex(/\d/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain special character"),

    confirmPassword: z.string(),

    role: UserRoleSchema,

    termsAccepted: z
      .boolean()
      .refine((value) => value === true, {
        message: "You must accept the terms",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
