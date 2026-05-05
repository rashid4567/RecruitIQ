import {
  BillingEventType,
  BillingRecord,
  BillingStatus,
} from "../../../domain/entities/Billingrecord.entity";
import { BillingRecordRepository } from "../../../domain/repositories/billing.repository";

export interface RecordPaymentRequest {
  recruiterId: string;
  subscriptionId: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  tax?: number;
  discount?: number;
  netAmount: number;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  razorpayInvoiceId?: string;
  invoiceUrl?: string;
  eventType: BillingEventType;
  periodStart: Date;
  periodEnd: Date;
  paidAt: Date;
}

export interface RecordPaymentResponse {
  billingRecord: BillingRecord;
  isDuplicate: boolean;
}

export class RecordPaymentUseCase {
  constructor(private readonly billingRecordRepo: BillingRecordRepository) {}

  async execute(request: RecordPaymentRequest): Promise<RecordPaymentResponse> {
    const existing = await this.billingRecordRepo.findByRazorpayPaymentId(
      request.razorpayPaymentId,
    );

    if (existing) {
      return { billingRecord: existing, isDuplicate: true };
    }

    const billingRecord = await this.billingRecordRepo.create({
      recruiterId: request.recruiterId,
      subscriptionId: request.subscriptionId,
      planId: request.planId,
      planName: request.planName,
      amount: request.amount,
      currency: request.currency,
      tax: request.tax,
      discount: request.discount,
      netAmount: request.netAmount,
      razorpayPaymentId: request.razorpayPaymentId,
      razorpayOrderId: request.razorpayOrderId,
      razorpayInvoiceId: request.razorpayInvoiceId,
      invoiceUrl: request.invoiceUrl,
      eventType: request.eventType,
      status: BillingStatus.Paid,
      periodStart: request.periodStart,
      periodEnd: request.periodEnd,
      paidAt: request.paidAt,
    });

    return { billingRecord, isDuplicate: false };
  }
}
