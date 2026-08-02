import { useCallback, useEffect, useState } from "react";
import { getOfferDetails } from "../../api/recruiter-offer.api";
import type { GetOfferDetailsResponse } from "../../types/recruiterOffer.types";

export function useOfferDetails(offerId: string) {
  const [offer, setOffer] = useState<GetOfferDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchOffer = useCallback(async () => {
    if (!offerId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getOfferDetails(offerId);
      setOffer(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "There was an issue fetching the offer details.";

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
