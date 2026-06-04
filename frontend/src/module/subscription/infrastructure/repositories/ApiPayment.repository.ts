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
   
      const res = await api.post<{
        success: boolean;
        message?: string;
        data: CreateSubscriptionPaymentOutput;
      }>("/recruiter/payment/order", {
        planId: input.planId,
        durationMonths: input.durationMonths,

      });

     
      return res.data.data;
    } catch (error: unknown) {
     if(error instanceof Error){
      console.log(error.message);
     }
      throw error;
    }
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
    try {
     
      const res = await api.post<{
        success: boolean;
        message: string;
        data: VerifyPaymentOutput;
      }>("/recruiter/payment/verify", input);
     
      return res.data.data;
    } catch (error: unknown) {
      if(error instanceof Error){
        console.log(error.message)
      }
      throw error;
    }
  }
}
