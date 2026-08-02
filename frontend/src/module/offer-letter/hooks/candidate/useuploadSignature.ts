import { useState } from "react";

import { uploadSignature } from "../../api/candidate-offer.api";

export function useUploadSignature() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const execute = async (offerId: string, file: File): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const response = await uploadSignature(offerId, file);

      return response.signatureUrl;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload signature";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadSignature: execute,
    loading,
    error,
  };
}
