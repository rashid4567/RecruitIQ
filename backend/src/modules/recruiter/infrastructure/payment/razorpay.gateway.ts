import { razorpay } from "../../../../config/razorpay";

import {
  PaymentGateway,
  CreateOrderInput,
  CreateOrderOutput,
} from "../../application/ports/payment-gateway.port";

export class RazorpayGateway implements PaymentGateway {

  async createOrder(
    input: CreateOrderInput
  ): Promise<CreateOrderOutput> {

    const order = await razorpay.orders.create({
      amount: input.amount * 100,
      currency: input.currency,
      receipt: input.receipt,
      notes: input.notes,
    });

    return {
      id: String(order.id),

      amount: Number(order.amount),

      currency: String(order.currency),

      status: String(order.status),
    };
  }
}