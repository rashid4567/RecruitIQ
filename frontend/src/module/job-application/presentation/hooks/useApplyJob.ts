import { useState, useCallback } from "react";
import type { ApplyJobDTO } from "../../domain/repository/application.repository";
import type { JobApplication } from "../../domain/entity/job-application.entity";
import { applyJobUC } from "../di/application.di";

interface UseApplyJobReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  application: JobApplication | null;

  apply: (
    data: ApplyJobDTO,
  ) => Promise<JobApplication | null>;

  reset: () => void;
}

export function useApplyJob(): UseApplyJobReturn {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(false);

  const [application, setApplication] =
    useState<JobApplication | null>(null);

  const apply = useCallback(
    async (
      data: ApplyJobDTO,
    ): Promise<JobApplication | null> => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result =
          await applyJobUC.execute(data);

        setApplication(result);
        setSuccess(true);

        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to apply for job";

        setError(message);

        console.error(
          "Apply job error:",
          err,
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setApplication(null);
  }, []);

  return {
    loading,
    error,
    success,
    application,
    apply,
    reset,
  };
}