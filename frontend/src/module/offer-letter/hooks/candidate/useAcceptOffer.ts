import { useState } from "react";

import { acceptOffer } from "../../api/candidate-offer.api";

import type {
  AcceptOfferRequest,
  AcceptOfferResponse,
} from "../../types/candidateOffer.types";

export function useAcceptOffer() {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const execute = async (
    offerId: string,
    data: AcceptOfferRequest,
  ): Promise<AcceptOfferResponse> => {
    setLoading(true);
    setError(null);

    try {
      return await acceptOffer(offerId, data);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    acceptOffer: execute,
    loading,
    error,
  };
}