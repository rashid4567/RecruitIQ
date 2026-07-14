import { useCallback, useEffect, useState } from "react";

import { getCandidateOffer } from "../../api/candidate-offer.api";

import type { GetCandidateOfferResponse } from "../../types/candidateOffer.types";

export function useCandidateOffer(offerId: string) {
  const [offer, setOffer] =
    useState<GetCandidateOfferResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchOffer = useCallback(async () => {
    if (!offerId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getCandidateOffer(offerId);
      setOffer(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Facing an issue while fetching the candidate offer.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [offerId]);

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

  return {
    offer,
    loading,
    error,
    refetch: fetchOffer,
  };
}