import { useState } from "react";
import { completeProfileUC } from "../di/candidate";
import type { CompleteCandidateProfileForm } from "../types/candidate-profile.types";
import { getError } from "@/utils/getError";

export function useCompleteCandidateProfile() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeProfile = async (
    formData: CompleteCandidateProfileForm
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await completeProfileUC.execute({
        currentJob: formData.currentJob,
        experienceYears: Number(formData.experienceYears) || undefined,
        educationLevel: formData.educationLevel,
        skills: formData.skills,
        preferredJobLocations: formData.preferredJobLocations
          ? [formData.preferredJobLocations]
          : [],
        bio: formData.bio,
        linkedinUrl: formData.linkedinUrl || undefined,
      });
    } catch (err: unknown) {
        setError(getError(err))
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    completeProfile,
    isSubmitting,
    error,
  };
}
