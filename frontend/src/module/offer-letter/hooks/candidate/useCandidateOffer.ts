import { useEffect, useState } from "react";

import { getCandidateOffer } from "../../api/candidate-offer.api";

import type { GetCandidateOfferResponse } from "../../types/candidateOffer.types";

export function useCandidateOffer(
  offerId: string,
) {
  const [offer, setOffer] =
    useState<GetCandidateOfferResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchOffer = async () => {
    setLoading(true);

    try {
      const data = await getCandidateOffer(offerId);
      setOffer(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (offerId) {
      fetchOffer();
    }
  }, [offerId]);

  return {
    offer,
    loading,
    error,
    refetch: fetchOffer,
  };
}