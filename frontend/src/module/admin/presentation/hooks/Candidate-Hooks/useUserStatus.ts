import { useState } from "react";
import { blockUserUC, unblockUserUC } from "../di/user.di";
import { getError } from "@/utils/getError";

interface UseUserStatusOptions {
  onSuccess?: () => void;
}

export function useUserStatus(options?: UseUserStatusOptions) {
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const setLoading = (userId: string, value: boolean) => {
    setLoadingMap((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  const blockUser = async (userId: string) => {
    try {
      setLoading(userId, true);
      setError(null);

      await blockUserUC.execute(userId);

      options?.onSuccess?.();
    } catch (err: unknown) {
      setError(getError(err ?? "Failed to block user"));
      throw err;
    } finally {
      setLoading(userId, false);
    }
  };

  const unblockUser = async (userId: string) => {
    try {
      setLoading(userId, true);
      setError(null);

      await unblockUserUC.execute(userId);

      options?.onSuccess?.();
    } catch (err: unknown) {
      setError(getError(err ?? "Failed to unblock user"));
      throw err;
    } finally {
      setLoading(userId, false);
    }
  };

  const toggleUserStatus = async (
    userId: string,
    isCurrentlyActive: boolean,
  ) => {
    if (isCurrentlyActive) {
      return blockUser(userId);
    }
    return unblockUser(userId);
  };

  return {
    blockUser,
    unblockUser,
    toggleUserStatus,
    loadingMap,
    error,
  };
}
