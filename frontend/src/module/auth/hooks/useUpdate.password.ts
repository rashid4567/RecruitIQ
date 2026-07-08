import { useState } from "react";
import { updatePassword } from "../api/auth.api";
import type { UpdatePasswordPayload } from "../types/auth.types";

export const useUpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdatePassword = async (
    payload: UpdatePasswordPayload,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await updatePassword(payload);

      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update password.";

      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleUpdatePassword,
    loading,
    error,
    setError,
  };
};