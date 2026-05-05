import { ApplicationError } from "../../../../../shared/errors/application.error";
import { BillingRecord, BillingStatus } from "../../../domain/entities/Billingrecord.entity";
import { BillingRecordRepository } from "../../../domain/repositories/billing.repository";
import { ERROR_CODES } from "../../constants/error.code.constants";

export interface UpdateBillingStatusRequest {
  billingRecordId: string;
  newStatus:       BillingStatus;
  paidAt?:         Date;
  failureReason?:  string;
  invoiceUrl?:     string;
}


export type UpdatedBillingStatusResponse = BillingRecord;

const ALLOWED_TRANSITIONS: Record<BillingStatus, BillingStatus[]> = {
  [BillingStatus.Pending]:           [BillingStatus.Paid, BillingStatus.Failed],
  [BillingStatus.Paid]:              [BillingStatus.Refunded, BillingStatus.PartiallyRefunded],
  [BillingStatus.Failed]:            [BillingStatus.Pending],   
  [BillingStatus.PartiallyRefunded]: [BillingStatus.Refunded],
  [BillingStatus.Refunded]:          [],                        
};


export class UpdateBillingStatusUseCase {
    constructor(private readonly billingRecordRepo : BillingRecordRepository){}

    async execute(request : UpdateBillingStatusRequest):Promise<UpdatedBillingStatusResponse>{
        const record = await this.billingRecordRepo.findById(request.billingRecordId);

        if(!record){
            throw new ApplicationError(ERROR_CODES.BILLING_RECORD_NOT_FOUND)
        }
        
        const allowed = ALLOWED_TRANSITIONS[record.status] ?? [];
        if(!allowed.includes(request.newStatus)){
            throw new ApplicationError(ERROR_CODES.INVALID_BILLING_STATUS_TRANSITION);
        }

        return this.billingRecordRepo.updateStatus(
            request.billingRecordId,
            request.newStatus,
            {
                paidAt : request.paidAt,
                failureReason : request.failureReason,
                invoiceUrl : request.invoiceUrl,
            }
        )
    }
}