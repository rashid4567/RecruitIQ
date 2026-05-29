// import { Types } from "mongoose";

// import {
//   BillingRecord,
//   BillingRecordProps,
//   BillingStatus,
//   BillingEventType,
// } from "../../domain/entities/Billingrecord.entity";

// import {
//   PaginationOptions,
//   PaginatedResult,
// } from "../../../admin/Domain/repositories/jobPost-repository";
// import {
//   BillingFilterOptions,
//   BillingRecordRepository,
//   CreateBillingRecordInput,
// } from "../../domain/repositories/billing.repository";
// import {
//   BillingRecordModel,
//   IBillingRecord,
// } from "../../../subscription/infrastructure/mongoose/Billingrecord.model";

// export class MongooseBillingRecordRepository implements BillingRecordRepository {
//   private safePage(p?: number) {
//     return Math.max(1, p ?? 1);
//   }
//   private safeLimit(l?: number) {
//     return Math.min(50, Math.max(1, l ?? 10));
//   }

//   async findById(id: string): Promise<BillingRecord | null> {
//     if (!Types.ObjectId.isValid(id)) return null;

//     const doc = await BillingRecordModel.findById(id);
//     return doc ? this.toEntity(doc) : null;
//   }

//   async findByRazorpayPaymentId(
//     paymentId: string,
//   ): Promise<BillingRecord | null> {
//     const doc = await BillingRecordModel.findOne({
//       razorpayPaymentId: paymentId,
//     });
//     return doc ? this.toEntity(doc) : null;
//   }

//   async findByRecruiterId(
//     recruiterId: string,
//     filters?: BillingFilterOptions,
//     pagination?: PaginationOptions,
//   ): Promise<PaginatedResult<BillingRecord>> {
//     if (!Types.ObjectId.isValid(recruiterId)) {
//       return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
//     }

//     const query: Record<string, unknown> = {
//       recruiterId: new Types.ObjectId(recruiterId),
//     };

//     if (filters?.status) query.status = filters.status;
//     if (filters?.eventType) query.eventType = filters.eventType;
//     if (filters?.fromDate || filters?.toDate) {
//       query.createdAt = {
//         ...(filters.fromDate && { $gte: filters.fromDate }),
//         ...(filters.toDate && { $lte: filters.toDate }),
//       };
//     }

//     const page = this.safePage(pagination?.page);
//     const limit = this.safeLimit(pagination?.limit);
//     const skip = (page - 1) * limit;

//     const [docs, total] = await Promise.all([
//       BillingRecordModel.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit),
//       BillingRecordModel.countDocuments(query),
//     ]);

//     return {
//       data: docs.map((doc) => this.toEntity(doc)),
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   async findBySubscriptionId(
//     subscriptionId: string,
//     pagination?: PaginationOptions,
//   ): Promise<PaginatedResult<BillingRecord>> {
//     if (!Types.ObjectId.isValid(subscriptionId)) {
//       return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
//     }

//     const query = { subscriptionId: new Types.ObjectId(subscriptionId) };
//     const page = this.safePage(pagination?.page);
//     const limit = this.safeLimit(pagination?.limit);
//     const skip = (page - 1) * limit;

//     const [docs, total] = await Promise.all([
//       BillingRecordModel.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit),
//       BillingRecordModel.countDocuments(query),
//     ]);

//     return {
//       data: docs.map((doc) => this.toEntity(doc)),
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   async create(input: CreateBillingRecordInput): Promise<BillingRecord> {
//     const doc = await BillingRecordModel.create({
//       recruiterId: new Types.ObjectId(input.recruiterId),
//       subscriptionId: new Types.ObjectId(input.subscriptionId),
//       planId: new Types.ObjectId(input.planId),
//       planName: input.planName,
//       amount: input.amount,
//       currency: input.currency,
//       tax: input.tax,
//       discount: input.discount,
//       netAmount: input.netAmount,
//       razorpayPaymentId: input.razorpayPaymentId,
//       razorpayOrderId: input.razorpayOrderId,
//       razorpayInvoiceId: input.razorpayInvoiceId,
//       invoiceUrl: input.invoiceUrl,
//       eventType: input.eventType,
//       status: input.status,
//       failureReason: input.failureReason,
//       periodStart: input.periodStart,
//       periodEnd: input.periodEnd,
//       paidAt: input.paidAt,
//     });

//     return this.toEntity(doc);
//   }

//   async updateStatus(
//     billingRecordId: string,
//     status: BillingStatus,
//     extras?: { paidAt?: Date; failureReason?: string; invoiceUrl?: string },
//   ): Promise<BillingRecord> {
//     const set: Record<string, unknown> = { status };

//     if (extras?.paidAt) set.paidAt = extras.paidAt;
//     if (extras?.failureReason) set.failureReason = extras.failureReason;
//     if (extras?.invoiceUrl) set.invoiceUrl = extras.invoiceUrl;

//     const doc = await BillingRecordModel.findByIdAndUpdate(
//       billingRecordId,
//       { $set: set },
//       { new: true },
//     );

//     if (!doc) throw new Error(`BillingRecord "${billingRecordId}" not found.`);
//     return this.toEntity(doc);
//   }

//   async sumPaidAmount(
//     recruiterId: string,
//     fromDate?: Date,
//     toDate?: Date,
//   ): Promise<number> {
//     if (!Types.ObjectId.isValid(recruiterId)) return 0;

//     const match: Record<string, unknown> = {
//       recruiterId: new Types.ObjectId(recruiterId),
//       status: BillingStatus.Paid,
//     };

//     if (fromDate || toDate) {
//       match.paidAt = {
//         ...(fromDate && { $gte: fromDate }),
//         ...(toDate && { $lte: toDate }),
//       };
//     }

//     const result = await BillingRecordModel.aggregate<{ total: number }>([
//       { $match: match },
//       { $group: { _id: null, total: { $sum: "$netAmount" } } },
//     ]);

//     return result[0]?.total ?? 0;
//   }

//   private toEntity(doc: IBillingRecord): BillingRecord {
//     const props: BillingRecordProps = {
//       id: (doc._id as Types.ObjectId).toString(),
//       recruiterId: doc.recruiterId.toString(),
//       subscriptionId: doc.subscriptionId.toString(),
//       planId: doc.planId.toString(),
//       planName: doc.planName,
//       amount: doc.amount,
//       currency: doc.currency,
//       tax: doc.tax,
//       discount: doc.discount,
//       netAmount: doc.netAmount,
//       razorpayPaymentId: doc.razorpayPaymentId,
//       razorpayOrderId: doc.razorpayOrderId,
//       razorpayInvoiceId: doc.razorpayInvoiceId,
//       invoiceUrl: doc.invoiceUrl,
//       eventType: doc.eventType as BillingEventType,
//       status: doc.status as BillingStatus,
//       failureReason: doc.failureReason,
//       periodStart: doc.periodStart,
//       periodEnd: doc.periodEnd,
//       paidAt: doc.paidAt,
//       createdAt: doc.createdAt,
//     };

//     return BillingRecord.create(props);
//   }
// }
 