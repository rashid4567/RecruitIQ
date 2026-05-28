import { Payment, PaymentStatus, PaymentType } from "../entity/payment.entity";


export interface PaymentRepository {
  create(payment: Payment): Promise<Payment>;
  update(payment: Payment): Promise<Payment>;
  delete(paymentId: string): Promise<void>;
  findById(paymentId: string): Promise<Payment | null>;
  findByRazorpayPaymentId(paymentId: string): Promise<Payment | null>;
  findByRazorpayOrderId(orderId: string): Promise<Payment | null>;
  findByRecruiterId(recruiterId: string): Promise<Payment[]>;
  findBySubscriptionId(subscriptionId: string): Promise<Payment[]>;
  findByPlanId(planId: string): Promise<Payment[]>;
  findByStatus(status: PaymentStatus): Promise<Payment[]>;
  findByType(type: PaymentType): Promise<Payment[]>;
  findPending(): Promise<Payment[]>;
  findFailed(): Promise<Payment[]>;
  findPaid(): Promise<Payment[]>;
  findRefunded(): Promise<Payment[]>;
  existsById(paymentId: string): Promise<boolean>;
  existsByOrderId(orderId: string): Promise<boolean>;
  getTotalRevenue(): Promise<number>;
  getRecruiterRevenue(recruiterId: string): Promise<number>;
  countByStatus(status: PaymentStatus): Promise<number>;
}
