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

    console.log("\n========== API CREATE SUBSCRIPTION ==========");

    console.log("INPUT:", input);

    console.log("PLAN ID:", input?.planId);

    console.log("REQUEST PAYLOAD:", {
      planId: input?.planId,
    });

    try {
      const res = await api.post<{
        success: boolean;
        data: CreateSubscriptionPaymentOutput;
      }>(
        "/recruiter/payment/create-subscription",
        {
          planId: input.planId,
        },
      );

      console.log("API RESPONSE STATUS:", res.status);

      console.log("API RESPONSE DATA:", res.data);

      console.log("CREATE SUBSCRIPTION SUCCESS");
      console.log("============================================\n");

      return res.data.data;

    } catch (err: any) {

      console.error("\n========== API CREATE SUBSCRIPTION ERROR ==========");

      console.error("ERROR MESSAGE:", err?.message);

      console.error("ERROR STATUS:", err?.response?.status);

      console.error("ERROR RESPONSE:", err?.response?.data);

      console.error("FULL ERROR:", err);

      console.error("===================================================\n");

      throw err;
    }
  }

  async verifyPayment(
    input: VerifyPaymentInput,
  ): Promise<VerifyPaymentOutput> {

    console.log("\n========== API VERIFY PAYMENT ==========");

    console.log("VERIFY INPUT:", input);

    try {
      const res = await api.post<{
        success: boolean;
        data: VerifyPaymentOutput;
      }>(
        "/recruiter/payment/verify",
        input,
      );

      console.log("VERIFY RESPONSE STATUS:", res.status);

      console.log("VERIFY RESPONSE DATA:", res.data);

      console.log("VERIFY PAYMENT SUCCESS");
      console.log("========================================\n");

      return res.data.data;

    } catch (err: any) {

      console.error("\n========== API VERIFY PAYMENT ERROR ==========");

      console.error("ERROR MESSAGE:", err?.message);

      console.error("ERROR STATUS:", err?.response?.status);

      console.error("ERROR RESPONSE:", err?.response?.data);

      console.error("FULL ERROR:", err);

      console.error("==============================================\n");

      throw err;
    }
  }
}