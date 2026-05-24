import { BillingEventType, BillingRecord, BillingStatus } from "../../../domain/entities/Billingrecord.entity";
import { BillingFilterOptions, BillingRecordRepository } from "../../../domain/repositories/billing.repository";
import { PaginatedResult, PaginationOptions } from "../../../domain/repositories/recruiter-subscription.repository";

export interface GetBillingHistoryRequest{
    recruiterId : string;
    filter ?: {
        status ?: BillingStatus;
        eventType ?: BillingEventType;
        fromDate ?: Date;
        toDate ?: Date;
    }
    pagination ?: PaginationOptions;
}

export type GetBillingHistoryResponse  = PaginatedResult<BillingRecord>;


export class GetBillingHistoryUseCase{
    constructor(private readonly billingRecordRepo : BillingRecordRepository){};

    async execute(request : GetBillingHistoryRequest):Promise<GetBillingHistoryResponse>{
        const filter : BillingFilterOptions = {
            ...(request.filter?.status && {status : request.filter.status}),
            ...(request.filter?.eventType && {eventType : request.filter.eventType}),
            ...(request.filter?.fromDate && {fromDate : request.filter.fromDate}),
            ...(request.filter?.toDate && {toDate : request.filter.toDate}),
        }

        const pagination : PaginationOptions = {
            page : request.pagination?.page ?? 1,
            limit : request.pagination?.limit ?? 10,
        }

        return this.billingRecordRepo.findByRecruiterId(
            request.recruiterId,
            Object.keys(filter).length ? filter : undefined,
            pagination,
        )
    }
}