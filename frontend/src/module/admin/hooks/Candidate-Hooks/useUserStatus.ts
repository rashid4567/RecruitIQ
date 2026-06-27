import { useState } from "react";

import {
  blockUser as blockUserApi,
  unblockUser as unblockUserApi,
} from "../../api/adminUser.api";

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

      await blockUserApi(userId);

      options?.onSuccess?.();
    } catch (err) {
      setError(getError(err));
      throw err;
    } finally {
      setLoading(userId, false);
    }
  };

  const unblockUser = async (userId: string) => {
    try {
      setLoading(userId, true);
      setError(null);

      await unblockUserApi(userId);

      options?.onSuccess?.();
    } catch (err) {
      setError(getError(err));
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
      await blockUser(userId);
    } else {
      await unblockUser(userId);
    }
  };

  return {
    blockUser,
    unblockUser,
    toggleUserStatus,
    loadingMap,
    error,
  };
}