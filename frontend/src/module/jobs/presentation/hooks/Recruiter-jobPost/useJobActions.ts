import { useState } from "react";
import { toast } from "sonner";
import type { JobCardProps } from "../../types/jobCard.types";
import { HideJobPostUC, UnhideJobPostUC } from "../../di/jobPost.di";

export function useRecruiterJobActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleHide = async (
    job: JobCardProps,
    onUpdated?: (updated: JobCardProps) => void,
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const hidden = job.visibility === "hidden";
      const updated = hidden
        ? await UnhideJobPostUC.execute(job.id)
        : await HideJobPostUC.execute(job.id);
      onUpdated?.({
        ...job,
        visibility: updated.visibility,
        isBlocked: updated.isBlocked,
        status:
          updated.status === "active"
            ? "Active"
            : updated.status === "expired"
              ? "Expired"
              : "Draft",
      });
      toast.success(hidden ? "Job unhidden" : "Job hidden");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  return {
    toggleHide,
    loading,
    error,
  };
}
