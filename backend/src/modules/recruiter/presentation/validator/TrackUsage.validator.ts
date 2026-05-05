import { z } from "zod";

const deltaSchema = z.number().refine((val) => val === 1 || val === -1, {
  message: "delta must be either 1 or -1",
});

export const trackUsageSchema = z
  .object({
    jobPostDelta: deltaSchema.optional(),
    screeningCreditDelta: deltaSchema.optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.jobPostDelta !== undefined ||
      data.screeningCreditDelta !== undefined,
    {
      message:
        "At least one of jobPostDelta or screeningCreditDelta must be provided",
      path: ["jobPostDelta"],
    },
  );

export type TrackUsageInput = z.infer<typeof trackUsageSchema>;
