import api from "@/api/axios";
import type {
  CreateSubscriptionPaymentInput,
  CreateSubscriptionPaymentOutput,
  PaymentRepository,
  VerifyPaymentInput,
  VerifyPaymentOutput,
} from "../../domain/repositories/payment.repository";

export class ApiPaymentRepository implements PaymentRepository {
  async createSubscription(
    input: CreateSubscriptionPaymentInput,
  ): Promise<CreateSubscriptionPaymentOutput> {
    try {
      console.log("========== CREATE SUBSCRIPTION PAYMENT ==========");
      console.log("PLAN ID:", input.planId);
      const res = await api.post<{
        success: boolean;
        message?: string;
        data: CreateSubscriptionPaymentOutput;
      }>("/recruiter/payment/order", {
        planId: input.planId,
      });

      console.log("CREATE PAYMENT RESPONSE:", res.data);
      console.log("ORDER CREATED:", res.data.data.orderId);
      return res.data.data;
    } catch (error: any) {
      console.error("========== CREATE PAYMENT ERROR ==========");
      console.error("STATUS:", error?.response?.status);
      console.error("MESSAGE:", error?.response?.data?.message);
      console.error("CODE:", error?.response?.data?.code);
      console.error("FULL ERROR:", error?.response?.data);
      throw error;
    }
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
    try {
      console.log("========== VERIFY PAYMENT ==========");
      console.log("VERIFY REQUEST:", input);
      const res = await api.post<{
        success: boolean;
        message: string;
        data: VerifyPaymentOutput;
      }>("/recruiter/payment/verify", input);
      console.log("VERIFY PAYMENT RESPONSE:", res.data);
      console.log("SUBSCRIPTION CREATED:", res.data.data.subscriptionId);
      return res.data.data;
    } catch (error: any) {
      console.error("========== VERIFY PAYMENT ERROR ==========");
      console.error("STATUS:", error?.response?.status);
      console.error("MESSAGE:", error?.response?.data?.message);
      console.error("CODE:", error?.response?.data?.code);
      console.error("FULL ERROR:", error?.response?.data);
      throw error;
    }
  }
}
