export interface CreateOrderInput {
  amount: number;
  currency: string;
  receipt: string;
  notes: Record<string, string | number>;
}

export interface CreateOrderOutput {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface VerifyPaymentInput {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentGateway {
  createOrder(
    input: CreateOrderInput,
  ): Promise<CreateOrderOutput>;

  verifySignature(
    input: VerifyPaymentInput,
  ): Promise<boolean>;
}