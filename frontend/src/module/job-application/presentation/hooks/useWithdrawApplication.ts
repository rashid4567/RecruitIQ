import { useState, useCallback } from "react";
import { WithdrawApplicationUC } from "../di/application.di";

export function useWithdrawApplication() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const withdraw = useCallback(
  async (applicationId: string): Promise<boolean> => {
    console.log("WITHDRAW CALLED", applicationId);

    setLoading(true);
    setError(null);

    try {
      await WithdrawApplicationUC.execute(applicationId);

      console.log("WITHDRAW SUCCESS");

      return true;
    } catch (err) {
      console.log("WITHDRAW ERROR", err);

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
