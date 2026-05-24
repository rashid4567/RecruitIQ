import {
  PaginatedResult,
  PaginationOptions,
} from "../../../admin/Domain/repositories/jobPost-repository";
import {
  BillingEventType,
  BillingRecord,
  BillingStatus,
} from "../entities/Billingrecord.entity";

export interface CreateBillingRecordInput {
  recruiterId: string;
  subscriptionId: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  tax?: number;
  discount?: number;
  netAmount: number;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpayInvoiceId?: string;
  invoiceUrl?: string;
  eventType: BillingEventType;
  status: BillingStatus;
  failureReason?: string;
  periodStart: Date;
  periodEnd: Date;
  paidAt?: Date;
}

export interface BillingFilterOptions {
  status?: BillingStatus;
  eventType?: BillingEventType;
  fromDate?: Date;
  toDate?: Date;
}

export interface BillingRecordRepository {
  findById(id: string): Promise<BillingRecord | null>;
  findByRazorpayPaymentId(paymentId: string): Promise<BillingRecord | null>;
  findByRecruiterId(
    recruiterId: string,
    filters?: BillingFilterOptions,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<BillingRecord>>;
  findBySubscriptionId(
    subscriptionId: string,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<BillingRecord>>;
  create(input: CreateBillingRecordInput): Promise<BillingRecord>;
  updateStatus(
    billingRecordId: string,
    status: BillingStatus,
    extras?: { paidAt?: Date; failureReason?: string; invoiceUrl?: string },
  ): Promise<BillingRecord>;
  sumPaidAmount(
    recruiterId: string,
    fromDate?: Date,
    toDate?: Date,
  ): Promise<number>;
}
