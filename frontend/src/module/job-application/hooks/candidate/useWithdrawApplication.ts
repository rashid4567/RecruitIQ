import { useState, useCallback } from "react";
import { withdrawApplication } from "../../api/candidate-application.api";

export function useWithdrawApplication() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const withdraw = useCallback(
  async (applicationId: string): Promise<boolean> => {
   
    setLoading(true);
    setError(null);

    try {
      await withdrawApplication(applicationId);


      return true;
    } catch (err) {

      const message =
        err instanceof Error
          ? err.message
          : "Failed to withdraw application";

      setError(message);

      return false;
    } finally {
      setLoading(false);
    }
  },
  [],
);

  return {
    withdraw,
    loading,
    error,
  };
}
