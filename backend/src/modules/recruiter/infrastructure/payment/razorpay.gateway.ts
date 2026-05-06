import { razorpay } from "../../../../config/razorpay";
import { PaymentGateway } from "../../application/ports/payment-gateway.port";
import { CreateSubscriptionInput, CreateSubscriptionOutput } from "../../application/ports/Paymentgateway.port";

export class RazorpayGateway implements PaymentGateway {
  async createSubscription(
    input: CreateSubscriptionInput,
  ): Promise<CreateSubscriptionOutput> {
    const sub = await razorpay.subscriptions.create({
      plan_id: input.planId,
      total_count: input.totalCount,
      quantity: 1,
      notes: input.notes,
    });

  
    return {
      id: (sub as { id: string; status: string }).id,
      status: (sub as { id: string; status: string }).status,
    };
  }
}