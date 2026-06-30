import { z } from "zod";

export const RescheduleInterviewSchema = z.object({
  scheduledAt: z.coerce.date(),

  durationInMinutes: z
    .number()
    .int()
    .min(15, "Interview duration must be at least 15 minutes"),

  meetingLink: z.string().trim().optional(),

  roomId: z.string().trim().optional(),

  location: z.string().trim().optional(),
});

export type RescheduleInterviewSchemaType = z.infer<
  typeof RescheduleInterviewSchema
>;