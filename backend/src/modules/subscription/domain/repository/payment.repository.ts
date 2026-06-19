import { BaseRepository } from "../../../../shared/repositories/base.repository";
import { Payment, PaymentStatus } from "../entities/payment.entity";

export interface PaymentRepository extends BaseRepository<Payment> {
  save(payment: Payment): Promise<void>;
  update(payment: Payment): Promise<void>;
  findByRazorpayOrderId(orderId: string): Promise<Payment | null>;
  findByRazorpayPaymentId(paymentId: string): Promise<Payment | null>;
  findByRecruiterId(recruiterId: string): Promise<Payment[]>;
  findBySubscriptionId(subscriptionId: string): Promise<Payment[]>;
  findByStatus(status: PaymentStatus): Promise<Payment[]>;
  existsByOrderId(orderId: string): Promise<boolean>;
}
