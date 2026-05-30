import crypto from "crypto";

import { razorpay } from "../../../../config/razorpay";

import {
  PaymentGateway,
  CreateOrderInput,
  CreateOrderOutput,
  VerifyPaymentInput,
} from "../../../subscription/application/ports/Paymentgateway.port";

import { RAZORPAY_KEY_SECRET } from "../../../../config/razorpay";

export class RazorpayGateway implements PaymentGateway {
  async createOrder(input: CreateOrderInput): Promise<CreateOrderOutput> {
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

  async verifySignature(input: VerifyPaymentInput): Promise<boolean> {
    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${input.orderId}|${input.paymentId}`)
      .digest("hex");

    return generatedSignature === input.signature;
  }
}
