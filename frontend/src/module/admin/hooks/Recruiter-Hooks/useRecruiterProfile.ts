import { getRecruiterProfile, rejectRecruiter, toggleRecruiterStatus, verifyRecruiter } from "@/module/admin/api/adminRecruiter.api";
import type { RecruiterProfile } from "@/module/admin/types/recruiter.types";
import { useState, useEffect, useCallback } from "react";



interface UseRecruiterProfileReturn {
  recruiter: RecruiterProfile | null;
  loading: boolean;
 error: string | null;
  actionLoading: boolean;
  refresh: () => Promise<void>;
  verify: () => Promise<void>;
  reject: () => Promise<void>;
  toggleStatus: () => Promise<void>;
}

export function useRecruiterProfile(
  recruiterId?: string,
): UseRecruiterProfileReturn {
  const [recruiter, setRecruiter] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!recruiterId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getRecruiterProfile(recruiterId);
      setRecruiter(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load recruiter profile",
      );
    } finally {
      setLoading(false);
    }
  }, [recruiterId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const verify = async () => {
    if (!recruiterId) return;

    try {
      setActionLoading(true);

      await verifyRecruiter(recruiterId);

      await fetchProfile();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to verify recruiter",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async () => {
    if (!recruiterId) return;

    try {
      setActionLoading(true);

      await rejectRecruiter(recruiterId);

      await fetchProfile();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reject recruiter",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!recruiterId || !recruiter) return;

    try {
      setActionLoading(true);

      await toggleRecruiterStatus(
        recruiterId,
        !recruiter.isActive,
      );

      await fetchProfile();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update recruiter status",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return {
    recruiter,
    loading,
    error,
    actionLoading,
    refresh: fetchProfile,
    verify,
    reject,
    toggleStatus,
  };
}