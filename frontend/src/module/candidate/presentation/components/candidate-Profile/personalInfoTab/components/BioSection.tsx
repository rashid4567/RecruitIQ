// components/profile/sections/BioSection.tsx
import React from 'react';
import { User, AlertCircle } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import type { ProfileFormData } from '@/module/candidate/presentation/validators/profileValidation'; 

interface BioSectionProps {
  isEditing: boolean;
  profile: {
    bio?: string | null;
  };
  editData: Partial<ProfileFormData>;
  validationErrors: Record<string, string>;
  onInputChange: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) => void;
}

export function BioSection({
  isEditing,
  profile,
  editData,
  validationErrors,
  onInputChange,
}: BioSectionProps) {
  return (
    <div className="space-y-4">
      <SectionHeader 
        icon={<User />} 
        title="Professional Bio" 
        iconBgColor="bg-emerald-100"
        iconColor="text-emerald-600"
      />

      <div className="space-y-2">
        {isEditing ? (
          <div>
            <textarea
              value={editData.bio ?? profile.bio ?? ""}
              onChange={(e) => onInputChange("bio", e.target.value)}
              className={`w-full p-4 rounded-lg border min-h-[120px] resize-y ${
                validationErrors.bio
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              }`}
              placeholder="Tell us about yourself, your experience, and what you're looking for..."
              maxLength={500}
            />
            {validationErrors.bio && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.bio}
              </p>
            )}
            <div className="flex justify-end mt-2">
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                {(editData.bio ?? profile.bio ?? "").length}/500 characters
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
            {profile.bio || "No bio provided"}
          </div>
        )}
      </div>
    </div>
  );
}