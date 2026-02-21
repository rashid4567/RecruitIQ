import { useMemo } from "react";
import type { CandidateProfile } from "../../domain/entities/candidateProfile";

export interface ProfileStats {
  experienceYears: number;
  skillsCount: number;
  completionPercentage: number;
  completedFields: number;
  totalFields: number;
  missingFields: string[];
}

export function useProfileStats(profile: CandidateProfile | null) {
  return useMemo(() => {
    if (!profile) {
      return {
        experienceYears: 0,
        skillsCount: 0,
        completionPercentage: 0,
        completedFields: 0,
        totalFields: 11,
        missingFields: [],
      };
    }

    const fields = [
      { key: 'fullName', label: 'Full Name', value: profile.fullName },
      { key: 'email', label: 'Email', value: profile.email },
      { key: 'currentJob', label: 'Current Job', value: profile.currentJob },
      { key: 'experienceYears', label: 'Experience', value: profile.experienceYears },
      { key: 'educationLevel', label: 'Education', value: profile.educationLevel },
      { key: 'skills', label: 'Skills', value: profile.skills?.length ? 'present' : null },
      { key: 'preferredJobLocations', label: 'Preferred Locations', value: profile.preferredJobLocations?.length ? 'present' : null },
      { key: 'currentJobLocation', label: 'Current Location', value: profile.currentJobLocation },
      { key: 'gender', label: 'Gender', value: profile.gender },
      { key: 'linkedinUrl', label: 'LinkedIn', value: profile.linkedinUrl },
      { key: 'portfolioUrl', label: 'Portfolio', value: profile.portfolioUrl },
    ];

    const completedFields = fields.filter(field => {
      if (Array.isArray(field.value)) {
        return field.value.length > 0;
      }
      return field.value !== null && field.value !== undefined && field.value !== '';
    });

    const missingFields = fields
      .filter(field => {
        if (Array.isArray(field.value)) {
          return field.value.length === 0;
        }
        return field.value === null || field.value === undefined || field.value === '';
      })
      .map(field => field.label);

    const completionPercentage = Math.round((completedFields.length / fields.length) * 100);


    const getStatus = (percentage: number) => {
      if (percentage === 100) return { color: "text-green-600", text: "Complete" };
      if (percentage >= 90) return { color: "text-green-500", text: "Almost there" };
      if (percentage >= 70) return { color: "text-amber-600", text: "Good progress" };
      if (percentage >= 50) return { color: "text-yellow-600", text: "Getting there" };
      return { color: "text-red-600", text: "Needs attention" };
    };

    const status = getStatus(completionPercentage);

    return {
      experienceYears: profile.experienceYears || 0,
      skillsCount: profile.skills?.length || 0,
      completionPercentage,
      completedFields: completedFields.length,
      totalFields: fields.length,
      missingFields,
      statusColor: status.color,
      statusText: status.text,
    };
  }, [profile]);
}

