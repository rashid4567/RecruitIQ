import { useState, useEffect, useCallback } from "react";

import {
  blockUser,
  unblockUser,
} from "@/module/admin/api/adminUser.api";

import { getCandidateProfile } from "@/module/admin/api/adminCandidate.api";

import type {
  CandidateProfile,
} from "@/module/admin/types/candidate.types";

export function useCandidateProfile(candidateId?: string) {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!candidateId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getCandidateProfile(candidateId);
      setProfile(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load candidate profile",
      );
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  const block = useCallback(async () => {
    if (!candidateId) return;

    setActionLoading(true);

    try {
      await blockUser(candidateId);

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              status: "Blocked",
            }
          : prev,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to block candidate",
      );
    } finally {
      setActionLoading(false);
    }
  }, [candidateId]);

  const unblock = useCallback(async () => {
    if (!candidateId) return;

    setActionLoading(true);

    try {
      await unblockUser(candidateId);

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              status: "Active",
            }
          : prev,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to unblock candidate",
      );
    } finally {
      setActionLoading(false);
    }
  }, [candidateId]);

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