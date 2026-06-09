import type { UpdateApplicationStatusDTO } from "@/module/job-application/domain/dto/updateApplicationStatus.dto";
import { useCallback, useState } from "react";
import { UpdateApplicationStatusUC } from "../../di/application.di";

interface UseUpdateApplicationStatusReturn {
  loading: boolean;
  error: string | null;
  updateStatus: (payload: UpdateApplicationStatusDTO) => Promise<boolean>;
  clearError: () => void;
}

export function useUpdateApplicationStatus(): UseUpdateApplicationStatusReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const updateStatus = useCallback(
    async (payload: UpdateApplicationStatusDTO): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await UpdateApplicationStatusUC.execute(payload);

        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update application status",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, error, updateStatus, clearError };
}