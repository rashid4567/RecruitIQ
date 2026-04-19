import type { JobCardProps } from "../../types/jobCard.types";
import { useState } from "react";
import { toast } from "sonner";

import { hideJobPostUC, unhideJobPostUC } from "../../di/jobPost.di";

export function useJobActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleHide = async (
    job: JobCardProps,
    onUpdated?: (updated: JobCardProps) => void,
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const isCurrentlyHidden = job.visibility === "hidden";

      const updated = isCurrentlyHidden
        ? await unhideJobPostUC.execute(job.id)
        : await hideJobPostUC.execute(job.id);

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

      toast.success(
        isCurrentlyHidden
          ? "Job unhidden successfully"
          : "Job hidden successfully",
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { toggleHide, loading, error };
}
