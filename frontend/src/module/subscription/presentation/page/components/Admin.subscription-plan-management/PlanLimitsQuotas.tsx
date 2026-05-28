import type { PlanFormData } from "../../../hooks/Admin.Subscription.plans.Hooks/usePlanEditor";
import { CollapsibleSection } from "./CollapsibleSection";
import { Briefcase, Brain, FileText, Star } from "lucide-react";

interface PlanLimitsQuotasProps {
  formData: PlanFormData;
  errors: Record<string, string>;
  handleChange: (field: keyof PlanFormData, value: string | number) => void;
}

function ErrorMsg({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-sm text-red-600">
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
      </svg>
      {message}
    </p>
  );
}

interface QuotaFieldProps {
  label: string;
  icon: React.ReactNode;
  field: keyof PlanFormData;
  value: number;
  error?: string;
  onChange: (field: keyof PlanFormData, value: number) => void;
  fieldCls: (field: string) => string;
}

function QuotaField({ label, icon, field, value, error, onChange, fieldCls }: QuotaFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-700 mb-2 block">
        <span className="flex items-center gap-1.5">
          {icon}
          {label} <span className="text-red-500">*</span>
        </span>
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(field, parseInt(e.target.value) || 0)}
        className={fieldCls(String(field))}
      />
      {error ? (
        <ErrorMsg message={error} />
      ) : (
        <p className="text-xs text-zinc-400 mt-1">Use -1 for unlimited</p>
      )}
    </div>
  );
}

export default function PlanLimitsQuotas({
  formData,
  errors,
  handleChange,
}: PlanLimitsQuotasProps) {
  const fieldCls = (field: string) =>
    `w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
      errors[field]
        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
        : "border-zinc-300 bg-white focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  return (
    <CollapsibleSection title="Limits & Quotas">
      <div className="grid grid-cols-2 gap-6">
        <QuotaField
          label="Job Posts per Month"
          icon={<Briefcase className="h-4 w-4 text-zinc-400" />}
          field="jobPostsPerMonth"
          value={formData.jobPostsPerMonth}
          error={errors.jobPostsPerMonth}
          onChange={handleChange}
          fieldCls={fieldCls}
        />

        <QuotaField
          label="AI Screening Credits"
          icon={<Brain className="h-4 w-4 text-zinc-400" />}
          field="screeningCredits"
          value={formData.screeningCredits}
          error={errors.screeningCredits}
          onChange={handleChange}
          fieldCls={fieldCls}
        />

        <QuotaField
          label="Resume Parses per Month"
          icon={<FileText className="h-4 w-4 text-zinc-400" />}
          field="resumeParsesPerMonth"
          value={formData.resumeParsesPerMonth}
          error={errors.resumeParsesPerMonth}
          onChange={handleChange}
          fieldCls={fieldCls}
        />

        <QuotaField
          label="AI Score Credits"
          icon={<Star className="h-4 w-4 text-zinc-400" />}
          field="aiScoreCredits"
          value={formData.aiScoreCredits}
          error={errors.aiScoreCredits}
          onChange={handleChange}
          fieldCls={fieldCls}
        />
      </div>
    </CollapsibleSection>
  );
}