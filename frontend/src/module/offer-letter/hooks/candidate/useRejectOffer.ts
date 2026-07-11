import { useState } from "react";

import { rejectOffer } from "../../api/candidate-offer.api";

import type {
  RejectOfferRequest,
  RejectOfferResponse,
} from "../../types/candidateOffer.types";

export function useRejectOffer() {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const execute = async (
    offerId: string,
    data: RejectOfferRequest,
  ): Promise<RejectOfferResponse> => {
    setLoading(true);
    setError(null);

    try {
      return await rejectOffer(
        offerId,
        data,
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    rejectOffer: execute,
    loading,
    error,
  };
}