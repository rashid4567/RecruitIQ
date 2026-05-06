export interface CreateSubscriptionInput {
  planId: string;
  totalCount: number;
  notes: Record<string, string>;
}

export interface CreateSubscriptionOutput {
  id: string;
  status: string;
}

export interface PaymentGateway {
  createSubscription(input: CreateSubscriptionInput): Promise<CreateSubscriptionOutput>;
}