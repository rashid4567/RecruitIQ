import { BillingRecordRepository } from "../../../domain/repositories/billing.repository";

export interface GetTotalSpendRequest {
  recruiterId: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface GetTotalSpendResponse {
  recruiterId: string;
  totalPaid: number;
  fromDate?: Date;
  toDate?: Date;
}

export class GetTotalSpendUseCase {
  constructor(private readonly billingRecordRepo: BillingRecordRepository) {}

  async execute(request: GetTotalSpendRequest): Promise<GetTotalSpendResponse> {
    const totalPaid = await this.billingRecordRepo.sumPaidAmount(
      request.recruiterId,
      request.fromDate,
      request.toDate,
    );

    return {
      recruiterId: request.recruiterId,
      totalPaid,
      fromDate: request.fromDate,
      toDate: request.toDate,
    };
  }
}
