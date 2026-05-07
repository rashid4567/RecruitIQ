import api from "@/api/axios";

import type {
  PaymentRepository,
  CreateSubscriptionPaymentInput,
  CreateSubscriptionPaymentOutput,
  VerifyPaymentInput,
  VerifyPaymentOutput,
} from "../../Domain/repositories/payment.repository";

export class ApiPaymentRepository implements PaymentRepository {
  async createSubscription(
    input: CreateSubscriptionPaymentInput,
  ): Promise<CreateSubscriptionPaymentOutput> {
    try {
      const res = await api.post<{
        success: boolean;
        data: CreateSubscriptionPaymentOutput;
      }>("/recruiter/payment/create-subscription", {
        planId: input.planId,
      });
      return res.data.data;
    } catch (err) {
      throw err;
    }
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
    try {
      const res = await api.post<{
        success: boolean;
        data: VerifyPaymentOutput;
      }>("/recruiter/payment/verify", input);
      return res.data.data;
    } catch (err) {
      throw err;
    }
  }
}
