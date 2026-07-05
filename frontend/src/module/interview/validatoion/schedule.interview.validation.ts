import { z } from "zod";
import type { InterviewMode } from "../types/interview.types";
import type {
  RescheduleInterviewRequest,
  ScheduleInterviewRequest,
} from "../types/recruiterInterview.types";

export const interviewModeEnum = z.enum(["ONLINE", "OFFLINE"], {
  error: "Please select an interview mode",
});

export const meetingLinkOptionEnum = z.enum(["later", "paste"]);

const titleSchema = z
  .string()
  .min(3, "Title must be at least 3 characters")
  .max(120, "Title must be under 120 characters");

const descriptionSchema = z
  .string()
  .max(1000, "Description must be under 1000 characters")
  .optional();

const durationSchema = z.coerce
  .number({ error: "Duration is required" })
  .min(15, "Minimum duration is 15 minutes")
  .max(480, "Maximum duration is 8 hours");

const dateSchema = z.string().min(1, "Date is required");
const hourSchema = z.string().min(1, "Hour is required");
const minuteSchema = z.string().min(1, "Minute is required");

const locationSchema = z
  .string()
  .max(200, "Location must be under 200 characters")
  .optional();

const meetingRoomSchema = z
  .string()
  .max(100, "Meeting room must be under 100 characters")
  .optional();

const meetingLinkSchema = z.string().optional();

interface MeetingModeFields {
  mode: InterviewMode;
  location?: string;
}

function refineMeetingModeFields(
  data: MeetingModeFields,
  ctx: z.RefinementCtx,
) {
  if (
    data.mode === "OFFLINE" &&
    (!data.location || data.location.trim() === "")
  ) {
    ctx.addIssue({
      path: ["location"],
      code: z.ZodIssueCode.custom,
      message: "Location is required for in-person interviews",
    });
  }
}

interface DateTimeFields {
  date: string;
  hour: string;
  minute: string;
}

function refineFutureDateTime(
  data: DateTimeFields,
  ctx: z.RefinementCtx,
  bufferMinutes = 5,
) {
  if (data.date && data.hour && data.minute) {
    const selected = new Date(
      `${data.date}T${data.hour.padStart(2, "0")}:${data.minute.padStart(2, "0")}:00`,
    );
    const cutoff = new Date();
    cutoff.setMinutes(cutoff.getMinutes() + bufferMinutes);
    if (!isNaN(selected.getTime()) && selected <= cutoff) {
      ctx.addIssue({
        path: ["date"],
        code: z.ZodIssueCode.custom,
        message: `Interview must be at least ${bufferMinutes} minutes from now`,
      });
    }
  }
}

export const scheduleInterviewSchema = z
  .object({
    applicationId: z.string().min(1, "Application ID is required"),
    title: titleSchema,
    description: descriptionSchema,
    mode: interviewModeEnum,
    date: dateSchema,
    hour: hourSchema,
    minute: minuteSchema,
    durationInMinutes: durationSchema,
    location: locationSchema,
    roomId: meetingRoomSchema,
    meetingLink: meetingLinkSchema,
    sendEmail: z.boolean(),
  })
  .superRefine((data, ctx) => {
    refineMeetingModeFields(data, ctx);
    refineFutureDateTime(data, ctx);
  });

export type ScheduleFormValues = z.infer<typeof scheduleInterviewSchema>;

export const scheduleStepFields: Record<
  number,
  Array<keyof ScheduleFormValues>
> = {
  0: ["applicationId"],
  1: ["title", "mode", "meetingLink", "location"],
  2: ["date", "hour", "minute", "durationInMinutes"],
  3: [],
};

export function toScheduleInterviewRequest(
  form: ScheduleFormValues,
): ScheduleInterviewRequest {
  const scheduledAt = new Date(
    `${form.date}T${form.hour.padStart(2, "0")}:${form.minute.padStart(2, "0")}:00`,
  ).toISOString();

  return {
    applicationId: form.applicationId,
    title: form.title,
    description: form.description || undefined,
    mode: form.mode,
    scheduledAt,
    durationInMinutes: form.durationInMinutes,
    location: form.mode === "OFFLINE" ? form.location : undefined,
    roomId: form.roomId || undefined,
  };
}

export const rescheduleInterviewSchema = z
  .object({
    mode: interviewModeEnum,
    date: dateSchema,
    hour: hourSchema,
    minute: minuteSchema,
    durationInMinutes: durationSchema,
    location: locationSchema,
    roomId: meetingRoomSchema,
    meetingLinkOption: meetingLinkOptionEnum,
    meetingLink: meetingLinkSchema,
  })
  .superRefine((data, ctx) => {
    refineMeetingModeFields(data, ctx);
    refineFutureDateTime(data, ctx);
  });

export type RescheduleFormValues = z.infer<typeof rescheduleInterviewSchema>;

export const rescheduleStepFields: Record<
  number,
  Array<keyof RescheduleFormValues>
> = {
  0: ["date", "hour", "minute", "durationInMinutes", "meetingLink", "location"],
  1: [],
};

export function toRescheduleInterviewRequest(
  form: RescheduleFormValues,
): RescheduleInterviewRequest {
  const scheduledAt = new Date(
    `${form.date}T${form.hour.padStart(2, "0")}:${form.minute.padStart(2, "0")}:00`,
  ).toISOString();

  return {
    scheduledAt,
    durationInMinutes: form.durationInMinutes,
    location: form.mode === "OFFLINE" ? form.location : undefined,
    roomId: form.roomId || undefined,
  };
}
export function splitIsoToLocalParts(iso: string): {
  date: string;
  hour: string;
  minute: string;
} {
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    return { date: "", hour: "10", minute: "00" };
  }
  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    hour: pad(d.getHours()),
    minute: pad(
      [0, 15, 30, 45].reduce((closest, m) =>
        Math.abs(m - d.getMinutes()) < Math.abs(closest - d.getMinutes())
          ? m
          : closest,
      ),
    ),
  };
}
