import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { RecruiterProfile } from "@/module/recruiter/Domain/entities/recruiterEntities";
import { GetRecruiterProfileUc } from "../../di/recruiter.di";

export function useRecruiterProfile() {
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await GetRecruiterProfileUc.execute();

      setProfile(data);
      return data;
    } catch (err: unknown) {
      
      console.error("Profile fetch error:", err);
      const message = err instanceof Error ? err.message : "Failed to load profile";
      setError(message);
      toast.error("Failed to load profile", {
        description: message,
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateLocalProfile = (updated: RecruiterProfile) => {
    setProfile(updated);
  };

  const clearProfile = () => {
    setProfile(null);
  };

  return {
    profile,
    isLoading,
    error,

    fetchProfile,
    updateLocalProfile,
    clearProfile,
  };
}
