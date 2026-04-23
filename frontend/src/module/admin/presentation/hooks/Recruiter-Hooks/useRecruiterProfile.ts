
import { useState, useEffect, useCallback } from "react";
import { Recruiter } from "../../../domain/entities/recruiter.entity";
import { ApiRecruiterRepository } from "../../../infrastructure/repositories/ApiRecruiterRepository";

const repository = new ApiRecruiterRepository();

interface UseRecruiterProfileReturn {
  recruiter: Recruiter | null;
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  refetch: () => Promise<void>;
  verifyRecruiter: () => Promise<void>;
  rejectRecruiter: () => Promise<void>;
  toggleActiveStatus: () => Promise<void>;
}

export function useRecruiterProfile(
  recruiterId: string | undefined
): UseRecruiterProfileReturn {
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!recruiterId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await repository.getProfile(recruiterId);
      setRecruiter(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load recruiter profile.");
    } finally {
      setLoading(false);
    }
  }, [recruiterId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const runAction = async (
    action: () => Promise<void>,
    optimisticUpdate?: () => Recruiter
  ) => {
    if (!recruiter || !recruiterId) return;
    setActionLoading(true);
    if (optimisticUpdate) setRecruiter(optimisticUpdate());
    try {
      await action();
      const updated = await repository.getProfile(recruiterId);
      setRecruiter(updated);
    } catch (err: any) {
      setError(err?.message ?? "Action failed. Please try again.");
      await fetchProfile();
    } finally {
      setActionLoading(false);
    }
  };

  const verifyRecruiter = () =>
    runAction(
      () => repository.updateVerificationStatus(recruiterId!, "verified"),
      () => recruiter!.withVerificationStatus("verified")
    );

  const rejectRecruiter = () =>
    runAction(
      () => repository.updateVerificationStatus(recruiterId!, "rejected"),
      () => recruiter!.withVerificationStatus("rejected")
    );

  const toggleActiveStatus = () =>
    runAction(
      () => repository.toggleActiveStatus(recruiterId!, !recruiter!.isActive),
      () => recruiter!.withActiveStatus(!recruiter!.isActive)
    );

  return {
    recruiter,
    loading,
    error,
    actionLoading,
    refetch: fetchProfile,
    verifyRecruiter,
    rejectRecruiter,
    toggleActiveStatus,
  };
}