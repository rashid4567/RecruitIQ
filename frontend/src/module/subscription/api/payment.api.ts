import api from "@/api/axios";

import type {
  CreateSubscriptionPaymentInput,
  CreateSubscriptionPaymentOutput,
  VerifyPaymentInput,
  VerifyPaymentOutput,
} from "../types/payment.types";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function createSubscriptionPayment(
  input: CreateSubscriptionPaymentInput,
): Promise<CreateSubscriptionPaymentOutput> {
  try {
    const { data } = await api.post<
      ApiResponse<CreateSubscriptionPaymentOutput>
    >("/recruiter/payment/order", {
      planId: input.planId,
      durationMonths: input.durationMonths,
    });

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
}

export async function verifySubscriptionPayment(
  input: VerifyPaymentInput,
): Promise<VerifyPaymentOutput> {
  try {
    const { data } = await api.post<ApiResponse<VerifyPaymentOutput>>(
      "/recruiter/payment/verify",
      input,
    );

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
}
