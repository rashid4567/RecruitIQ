import { BillingEventType, BillingRecord, BillingStatus } from "../../../domain/entities/Billingrecord.entity";
import { BillingRecordRepository } from "../../../domain/repositories/billing.repository";

export interface RecordFailedPaymentRequest{
    recruiterId : string;
    subscriptionId :string;
    planId :string;
    planName : string;
    amount : number;
    currency : string;
    netAmount : number;
    razorpayPaymentId ?: string;
    razorpayOrderId ?: string;
    failureReason :string;
    eventType : BillingEventType;
    periodStart : Date;
    periodEnd : Date;
}

export type RecordFailedPaymentResponse = BillingRecord;

export class RecordFailedPaymentUseCase{
    constructor(private readonly billingRecordRepo : BillingRecordRepository){};

    async execute(request : RecordFailedPaymentRequest):Promise<RecordFailedPaymentResponse>{
        if(request.razorpayPaymentId){
            const existing = await this.billingRecordRepo.findByRazorpayPaymentId(request.razorpayPaymentId);
            if(existing)return existing;
        }
        return this.billingRecordRepo.create({
            recruiterId : request.recruiterId,
            subscriptionId : request.subscriptionId,
            planId : request.planId,
            planName : request.planName,
            amount : request.amount,
            currency : request.currency,
            netAmount  : request.netAmount,
            razorpayPaymentId : request.razorpayPaymentId,
            razorpayOrderId : request.razorpayOrderId,
            eventType : request.eventType,
            status :  BillingStatus.Failed,
            failureReason : request.failureReason,
            periodStart : request.periodStart,
            periodEnd : request.periodEnd,
        })
    }
}