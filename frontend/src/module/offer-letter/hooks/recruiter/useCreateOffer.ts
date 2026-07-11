import { useState } from "react";
import { createOffer } from "../../api/recruiter-offer.api";

import type {
  CreateOfferRequest,
  CreateOfferResponse,
} from "../../types/recruiterOffer.types";

export function useCreateOffer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (
    data: CreateOfferRequest,
  ): Promise<CreateOfferResponse> => {
    setLoading(true);
    setError(null);

    try {
      return await createOffer(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create the offer";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOffer: execute,
    loading,
    error,
  };
}
