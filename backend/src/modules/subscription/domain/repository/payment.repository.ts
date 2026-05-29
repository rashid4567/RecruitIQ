import { Payment, PaymentStatus } from "../entities/payment.entity";

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  update(payment: Payment): Promise<void>;
  findById(paymentId: string): Promise<Payment | null>;
  findByRazorpayOrderId(orderId: string): Promise<Payment | null>;
  findByRazorpayPaymentId(paymentId: string): Promise<Payment | null>;
  findByRecruiterId(recruiterId: string): Promise<Payment[]>;
  findBySubscriptionId(subscriptionId: string): Promise<Payment[]>;
  findByStatus(status: PaymentStatus): Promise<Payment[]>;
  existsByOrderId(orderId: string): Promise<boolean>;
}