import { z } from "zod";
import { InterviewMode } from "../../domain/entity/interview.entity";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const ScheduleInterviewSchema = z
  .object({
    applicationId: z
      .string()
      .trim()
      .min(1, "Application ID is required")
      .regex(objectIdRegex, "Invalid application ID"),

    title: z
      .string()
      .trim()
      .min(1, "Interview title is required")
      .max(100, "Interview title cannot exceed 100 characters"),

    description: z
      .string()
      .trim()
      .max(2000, "Description cannot exceed 2000 characters")
      .optional(),

    mode: z.nativeEnum(InterviewMode),

    scheduledAt: z.coerce.date(),

    durationInMinutes: z
      .number()
      .int("Duration must be an integer")
      .min(15, "Interview duration must be at least 15 minutes")
      .max(480, "Interview duration cannot exceed 480 minutes"),

    location: z
      .string()
      .trim()
      .max(500, "Location cannot exceed 500 characters")
      .optional(),

    roomId: z
      .string()
      .trim()
      .max(100, "Room ID cannot exceed 100 characters")
      .optional(),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    if (data.scheduledAt <= now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledAt"],
        message: "Interview must be scheduled at least 5 minutes in the future",
      });
    }

    if (
      data.mode === InterviewMode.OFFLINE &&
      (!data.location || data.location.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["location"],
        message: "Location is required for offline interviews",
      });
    }
  });

export type ScheduleInterviewSchemaType = z.infer<
  typeof ScheduleInterviewSchema
>;
