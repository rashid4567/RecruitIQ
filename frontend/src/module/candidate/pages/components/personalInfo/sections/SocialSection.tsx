import { Input } from "@/components/ui/input";
import {
  Linkedin,
  Globe,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Link2,
} from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import type { ProfileFormData } from "@/module/candidate/validators/profileValidation";

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
  onFieldBlur: (field: keyof ProfileFormData) => void;
  getFieldError: (field: keyof ProfileFormData) => string | undefined;
  isFieldValid: (field: keyof ProfileFormData) => boolean;
}

function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="flex items-center gap-1 text-xs text-red-500 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

function inputClass(error?: string, valid?: boolean) {
  if (error)
    return "pl-10 h-12 border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 pr-10 bg-red-50/30";
  if (valid)
    return "pl-10 h-12 border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 pr-10";
  return "pl-10 h-12 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";
}

function TrailingIcon({ error, valid }: { error?: string; valid?: boolean }) {
  if (error)
    return (
      <AlertCircle className="absolute right-3 top-3.5 h-5 w-5 text-red-500 pointer-events-none" />
    );
  if (valid)
    return (
      <CheckCircle2 className="absolute right-3 top-3.5 h-5 w-5 text-green-500 pointer-events-none" />
    );
  return null;
}

export function SocialSection({
  isEditing,
  profile,
  editData,
  onInputChange,
  onFieldBlur,
  getFieldError,
  isFieldValid,
}: SocialSectionProps) {
  const err = (f: keyof ProfileFormData) => getFieldError(f);
  const valid = (f: keyof ProfileFormData) => isFieldValid(f);

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
            <div className="space-y-0">
              <div className="relative group">
                <Input
                  value={editData.linkedinUrl ?? profile.linkedinUrl ?? ""}
                  onChange={(e) => onInputChange("linkedinUrl", e.target.value)}
                  onBlur={() => onFieldBlur("linkedinUrl")}
                  className={inputClass(err("linkedinUrl"), valid("linkedinUrl"))}
                  placeholder="https://linkedin.com/in/username"
                  aria-invalid={!!err("linkedinUrl")}
                  aria-describedby={err("linkedinUrl") ? "linkedinUrl-error" : undefined}
                />
                <Linkedin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-[#0A66C2] transition-colors pointer-events-none" />
                <TrailingIcon error={err("linkedinUrl")} valid={valid("linkedinUrl")} />
              </div>
              <FieldError message={err("linkedinUrl")} id="linkedinUrl-error" />
            </div>
          ) : profile.linkedinUrl ? (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-900 group transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Linkedin className="h-4 w-4 text-[#0A66C2] shrink-0" />
                <span className="truncate text-sm">{profile.linkedinUrl}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </a>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-400 text-sm">
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
            <div className="space-y-0">
              <div className="relative group">
                <Input
                  value={editData.portfolioUrl ?? profile.portfolioUrl ?? ""}
                  onChange={(e) => onInputChange("portfolioUrl", e.target.value)}
                  onBlur={() => onFieldBlur("portfolioUrl")}
                  className={inputClass(err("portfolioUrl"), valid("portfolioUrl"))}
                  placeholder="https://yourportfolio.com"
                  aria-invalid={!!err("portfolioUrl")}
                  aria-describedby={err("portfolioUrl") ? "portfolioUrl-error" : undefined}
                />
                <Globe className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                <TrailingIcon error={err("portfolioUrl")} valid={valid("portfolioUrl")} />
              </div>
              <FieldError message={err("portfolioUrl")} id="portfolioUrl-error" />
            </div>
          ) : profile.portfolioUrl ? (
            <a
              href={profile.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-900 group transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Globe className="h-4 w-4 text-indigo-500 shrink-0" />
                <span className="truncate text-sm">{profile.portfolioUrl}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </a>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-400 text-sm">
              Not specified
            </div>
          )}
        </div>
      </div>
    </div>
  );
}