import { z } from "zod";
import { BillingEventType, BillingStatus } from "../../domain/entities/Billingrecord.entity";



const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, { message: "Invalid MongoDB ObjectId" });

const currencyEnum = z.enum(["INR", "USD", "EUR", "GBP"]);

export const billingRecordIdSchema = z.object({
  billingRecordId: objectId,
});


export const getBillingHistorySchema = z
  .object({
    status: z.nativeEnum(BillingStatus).optional(),
    eventType: z.nativeEnum(BillingEventType).optional(),

    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),

    page: z.coerce.number().int().min(1, {
      message: "page must be >= 1",
    }).default(1),

    limit: z.coerce.number().int().min(1).max(50, {
      message: "limit must be between 1 and 50",
    }).default(10),
  })
  .refine(
    (data) =>
      !data.fromDate ||
      !data.toDate ||
      data.fromDate <= data.toDate,
    {
      message: "fromDate must be before or equal to toDate",
      path: ["fromDate"],
    }
  );

export const getTotalSpendSchema = z
  .object({
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      !data.fromDate ||
      !data.toDate ||
      data.fromDate <= data.toDate,
    {
      message: "fromDate must be before or equal to toDate",
      path: ["fromDate"],
    }
  );

export const recordPaymentSchema = z
  .object({
    subscriptionId: objectId,
    planId: objectId,

    planName: z.string().min(1, {
      message: "planName is required",
    }),

    amount: z.number().min(0),
    currency: currencyEnum,

    tax: z.number().min(0).optional(),
    discount: z.number().min(0).optional(),

    netAmount: z.number().min(0),

    razorpayPaymentId: z.string().min(1, {
      message: "razorpayPaymentId is required",
    }),

    razorpayOrderId: z.string().optional(),
    razorpayInvoiceId: z.string().optional(),

    invoiceUrl: z.string().url().optional(),

    eventType: z.nativeEnum(BillingEventType),

    periodStart: z.coerce.date(),
    periodEnd: z.coerce.date(),

    paidAt: z.coerce.date(),
  })
  .refine((data) => data.periodStart < data.periodEnd, {
    message: "periodStart must be before periodEnd",
    path: ["periodStart"],
  });


export const recordFailedPaymentSchema = z
  .object({
    subscriptionId: objectId,
    planId: objectId,

    planName: z.string().min(1),

    amount: z.number().min(0),
    currency: currencyEnum,

    netAmount: z.number().min(0),

    razorpayPaymentId: z.string().optional(),
    razorpayOrderId: z.string().optional(),

    failureReason: z.string().min(1, {
      message: "failureReason is required",
    }),

    eventType: z.nativeEnum(BillingEventType),

    periodStart: z.coerce.date(),
    periodEnd: z.coerce.date(),
  })
  .refine((data) => data.periodStart < data.periodEnd, {
    message: "periodStart must be before periodEnd",
    path: ["periodStart"],
  });


export const updateBillingStatusSchema = z
  .object({
    newStatus: z.nativeEnum(BillingStatus),

    paidAt: z.coerce.date().optional(),
    failureReason: z.string().optional(),
    invoiceUrl: z.string().url().optional(),
  })
  .refine(
    (data) =>
      data.newStatus !== BillingStatus.Paid || data.paidAt,
    {
      message: "paidAt is required when status is 'paid'",
      path: ["paidAt"],
    }
  )
  .refine(
    (data) =>
      data.newStatus !== BillingStatus.Failed || data.failureReason,
    {
      message: "failureReason is required when status is 'failed'",
      path: ["failureReason"],
    }
  );


export type BillingRecordIdInput = z.infer<typeof billingRecordIdSchema>;
export type GetBillingHistoryInput = z.infer<typeof getBillingHistorySchema>;
export type GetTotalSpendInput = z.infer<typeof getTotalSpendSchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
export type RecordFailedPaymentInput = z.infer<typeof recordFailedPaymentSchema>;
export type UpdateBillingStatusInput = z.infer<typeof updateBillingStatusSchema>;