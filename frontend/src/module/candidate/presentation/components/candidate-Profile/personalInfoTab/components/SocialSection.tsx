// components/profile/sections/SocialSection.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import { Linkedin, Globe, ChevronRight, AlertCircle, Link2 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import type { ProfileFormData } from '@/module/candidate/presentation/validators/profileValidation'; 

interface SocialSectionProps {
  isEditing: boolean;
  profile: {
    linkedinUrl?: string | null;
    portfolioUrl?: string | null;
  };
  editData: Partial<ProfileFormData>;
  validationErrors: Record<string, string>;
  onInputChange: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) => void;
}

export function SocialSection({
  isEditing,
  profile,
  editData,
  validationErrors,
  onInputChange,
}: SocialSectionProps) {
  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={<Link2 />} 
        title="Social & Web Presence" 
        iconBgColor="bg-indigo-100"
        iconColor="text-indigo-600"
      />

      <div className="grid grid-cols-1 gap-6">
        {/* LinkedIn */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-[#0A66C2]" />
            LinkedIn Profile
          </label>
          {isEditing ? (
            <div className="relative group">
              <Input
                value={editData.linkedinUrl ?? profile.linkedinUrl ?? ""}
                onChange={(e) => onInputChange("linkedinUrl", e.target.value)}
                className={`pl-10 h-12 ${
                  validationErrors.linkedinUrl
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
                placeholder="https://linkedin.com/in/username"
              />
              <Linkedin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-[#0A66C2] transition-colors" />
              {validationErrors.linkedinUrl && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.linkedinUrl}
                </p>
              )}
            </div>
          ) : profile.linkedinUrl ? (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-900 group transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Linkedin className="h-4 w-4 text-[#0A66C2] flex-shrink-0" />
                <span className="truncate">{profile.linkedinUrl}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </a>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-400">
              Not specified
            </div>
          )}
        </div>

        {/* Portfolio */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-500" />
            Portfolio Website
          </label>
          {isEditing ? (
            <div className="relative group">
              <Input
                value={editData.portfolioUrl ?? profile.portfolioUrl ?? ""}
                onChange={(e) => onInputChange("portfolioUrl", e.target.value)}
                className={`pl-10 h-12 ${
                  validationErrors.portfolioUrl
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
                placeholder="https://yourportfolio.com"
              />
              <Globe className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              {validationErrors.portfolioUrl && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.portfolioUrl}
                </p>
              )}
            </div>
          ) : profile.portfolioUrl ? (
            <a
              href={profile.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-900 group transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Globe className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                <span className="truncate">{profile.portfolioUrl}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </a>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-400">
              Not specified
            </div>
          )}
        </div>
      </div>
    </div>
  );
}