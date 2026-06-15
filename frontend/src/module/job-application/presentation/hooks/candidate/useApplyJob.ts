import { useState, useCallback } from "react";
import { applyJobUC } from "../../di/application.di";

import type { ApplyJobDTO } from "../../../domain/repository/application.repository";
import type { JobApplication } from "../../../domain/entity/job-application.entity";

interface UseApplyJobReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  application: JobApplication | null;

  apply: (data: ApplyJobDTO) => Promise<JobApplication | null>;

  reset: () => void;
}

export function useApplyJob(): UseApplyJobReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [application, setApplication] = useState<JobApplication | null>(null);

  const apply = useCallback(
    async (data: ApplyJobDTO): Promise<JobApplication | null> => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await applyJobUC.execute(data);

        setApplication(result);
        setSuccess(true);

        return result;
      } catch (err: unknown) {
        let message = "Failed to apply for job";

        if (err instanceof Error) {
          switch (err.message) {
            case "RESUME_PROCESSING_PLEASE_WAIT":
              message =
                "Your resume is being analyzed. Please wait a few seconds and try again.";
              break;

            case "RESUME_PARSE_FAILED":
              message =
                "Resume analysis failed. Please upload your resume again.";
              break;

            case "APPLICATION_ALREADY_EXISTS":
              message = "You have already applied for this job.";
              break;

            case "JOB_NOT_ACTIVE":
              message = "This job is no longer accepting applications.";
              break;

            case "JOB_EXPIRED":
              message = "This job posting has expired.";
              break;

            case "RESUME_NOT_FOUND":
              message = "Please upload a resume before applying.";
              break;

            default:
              message = err.message;
          }
        }

        setError(message);

        console.error("Apply job error:", err);

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
