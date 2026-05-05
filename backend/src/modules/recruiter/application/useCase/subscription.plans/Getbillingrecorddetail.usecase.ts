import { ApplicationError } from "../../../../../shared/errors/application.error";
import { BillingRecord } from "../../../domain/entities/Billingrecord.entity";
import { BillingRecordRepository } from "../../../domain/repositories/billing.repository";
import { ERROR_CODES } from "../../constants/error.code.constants";

export interface GetBillingHistoryRequest{
    billingRecordId : string;
    recruiterId : string;
}

export type GetBillingRecordDetailResponse = BillingRecord;

export class GetBillingRecordDetailUseCase{
    constructor(private readonly billingRecordRepo : BillingRecordRepository){};

    async execute(request : GetBillingHistoryRequest):Promise<GetBillingRecordDetailResponse>{
        const record = await this.billingRecordRepo.findById(request.billingRecordId);
        if(!record){
            throw new ApplicationError(ERROR_CODES.BILLING_RECORD_NOT_FOUND);
        }
        if(record.recruiterId !== request.recruiterId){
            throw new ApplicationError(ERROR_CODES.BILLING_RECORD_ACCESS_DENIED);
        }
        return record;
    }   


}