import { useState } from "react";
import { toast } from "sonner";

import type { JobCardProps } from "../../types/jobCard.types";
import { hideJob, unhideJob } from "@/module/jobs/api/job.api";

export function useRecruiterJobActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapStatus = (
    status: string,
  ): "Active" | "Paused" | "Expired" | "Draft" | "Blocked" => {
    switch (status) {
      case "active":
        return "Active";
      case "expired":
        return "Expired";
      case "blocked":
        return "Blocked";
      case "paused":
        return "Paused";
      case "draft":
      default:
        return "Draft";
    }
  };

  const toggleHide = async (
    job: JobCardProps,
    onUpdated?: (updated: JobCardProps) => void,
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const isHidden = job.visibility === "hidden";

      const updatedJob = isHidden
        ? await unhideJob("recruiter", job.id)
        : await hideJob("recruiter", job.id);

      onUpdated?.({
        ...job,
        visibility: updatedJob.visibility,
        isBlocked: updatedJob.isBlocked,
        status: mapStatus(updatedJob.status),
        views: updatedJob.views,
        applications: updatedJob.applicationsCount,
      });

      toast.success(
        isHidden
          ? "Job is now visible to candidates"
          : "Job has been hidden from candidates",
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update job visibility";

      setError(message);
      toast.error(message);
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