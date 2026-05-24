import { useState, useEffect, useCallback } from "react";
import { Candidate } from "@/module/admin/domain/entities/candidates.entity";
import { getCandidateProfileUC } from "../../di/candidate.di";
import { blockUserUC, unblockUserUC } from "../../di/user.di";

export function useCandidateProfile(candidateId?: string) {
  const [profile, setProfile] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!candidateId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getCandidateProfileUC.execute(candidateId);
      setProfile(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  const block = async () => {
    if (!candidateId || !profile) return;

    setActionLoading(true);
    await blockUserUC.execute(candidateId);
    setProfile(profile.withStatus("Blocked"));
    setActionLoading(false);
  };

  const unblock = async () => {
    if (!candidateId || !profile) return;

    setActionLoading(true);
    await unblockUserUC.execute(candidateId);
    setProfile(profile.withStatus("Active"));
    setActionLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    actionLoading,
    refresh: fetchProfile,
    block,
    unblock,
  };
}
