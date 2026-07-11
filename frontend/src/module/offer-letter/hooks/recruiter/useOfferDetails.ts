import { useEffect, useState } from "react";

import { getOfferDetails } from "../../api/recruiter-offer.api";

import type { GetOfferDetailsResponse } from "../../types/recruiterOffer.types";

export function useOfferDetails(
  offerId: string,
) {
  const [offer, setOffer] =
    useState<GetOfferDetailsResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchOffer = async () => {
    setLoading(true);

    try {
      const data = await getOfferDetails(offerId);
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