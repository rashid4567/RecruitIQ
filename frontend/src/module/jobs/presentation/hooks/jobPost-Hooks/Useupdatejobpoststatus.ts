import { useCallback, useState } from "react";

import { BlockJobPostUC, UnBlockJobPostUC } from "../../di/jobPost.di";

interface UseUpdateJobPostStatusOptions {
  onSuccess?: (id: string, isBlocked: boolean) => void;

  onError?: (message: string) => void;
}

export const useUpdateJobPostStatus = ({
  onSuccess,
  onError,
}: UseUpdateJobPostStatusOptions = {}) => {
  const [loading, setLoading] = useState(false);

  const [pendingId, setPendingId] = useState<string | null>(null);

  const toggleBlock = useCallback(
    async (id: string, currentlyBlocked: boolean) => {
      setLoading(true);
      setPendingId(id);

      try {
        if (currentlyBlocked) {
          await UnBlockJobPostUC.execute(id);

          onSuccess?.(id, false);
        } else {
          await BlockJobPostUC.execute(id);

          onSuccess?.(id, true);
        }
      } catch (err: unknown) {
        let message = "Operation failed";

        if (err instanceof Error) {
          message = err.message;
        }

        if (typeof err === "object" && err !== null && "response" in err) {
          const axiosError = err as {
            response?: {
              data?: {
                message?: string;
              };
            };
          };

          message = axiosError.response?.data?.message ?? message;
        }

        onError?.(message);
      } finally {
        setLoading(false);
        setPendingId(null);
      }
    },
    [onSuccess, onError],
  );

  const block = useCallback(
    (id: string) => toggleBlock(id, false),
    [toggleBlock],
  );

  const unblock = useCallback(
    (id: string) => toggleBlock(id, true),
    [toggleBlock],
  );

  return {
    loading,
    pendingId,
    toggleBlock,
    block,
    unblock,
  };
};
