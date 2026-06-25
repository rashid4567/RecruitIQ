import { Input } from "@/components/ui/input";
import {
  DollarSign,
  Calendar,
  Link as LinkIcon,
  IndianRupee,
  Euro,
  PoundSterling,
  Info,
} from "lucide-react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Props {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
  errors: Record<string, string>;
  jobPostActiveDays?: number;
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
      <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0 text-[10px] font-bold">
        !
      </span>
      {msg}
    </p>
  );
}

const currencies = [
  { code: "INR", symbol: "₹", label: "Indian Rupee", icon: IndianRupee },
  { code: "USD", symbol: "$", label: "US Dollar", icon: DollarSign },
  { code: "EUR", symbol: "€", label: "Euro", icon: Euro },
  { code: "GBP", symbol: "£", label: "British Pound", icon: PoundSterling },
];

function formatSalaryDisplay(val: number, symbol: string) {
  if (!val) return null;
  if (val >= 100000) return `${symbol}${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `${symbol}${(val / 1000).toFixed(0)}K`;
  return `${symbol}${val}`;
}

export default function Step4Compensation({
  formData,
  setFormData,
  errors,
  jobPostActiveDays,
}: Props) {
  const selectedCurrency =
    currencies.find((c) => c.code === formData.salary.currency) ??
    currencies[0];
  const minDisplay = formatSalaryDisplay(
    formData.salary.min,
    selectedCurrency.symbol,
  );
  const maxDisplay = formatSalaryDisplay(
    formData.salary.max,
    selectedCurrency.symbol,
  );

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const maxDate = new Date(today);
  if (jobPostActiveDays) {
    maxDate.setDate(maxDate.getDate() + jobPostActiveDays);
  }
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Compensation & Details
          </h2>
        </div>
        <p className="text-gray-500 text-sm ml-10">
          Set salary expectations and application details
        </p>

        {/* Plan duration info card */}
        {jobPostActiveDays && (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Job Posting Duration
              </p>
              <p className="mt-0.5 text-sm text-blue-700">
                Your current subscription allows jobs to remain active for up to{" "}
                <span className="font-bold">{jobPostActiveDays} days</span>. The
                application deadline cannot exceed this limit.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-7">
        {/* Salary Range */}
        <div className="p-5 bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <label className="text-sm font-bold text-gray-800">
              Salary Range (Annual)
            </label>
            <span className="text-xs font-normal text-gray-400 ml-1">
              optional
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4 ml-6">
            Transparent salary info increases applications by up to 40%
          </p>

          {/* Currency selector */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-emerald-700/80 uppercase tracking-wider block mb-2">
              Currency
            </label>
            <div className="grid grid-cols-4 gap-2">
              {currencies.map((c) => {
                const isActive = formData.salary.currency === c.code;
                const Icon = c.icon;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        salary: { ...p.salary, currency: c.code },
                      }))
                    }
                    className={`flex flex-col items-center py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "border-emerald-500 bg-white shadow-md shadow-emerald-100/60 text-emerald-700"
                        : "border-transparent bg-white/60 text-gray-500 hover:bg-white hover:border-gray-200"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 mb-1 ${isActive ? "text-emerald-600" : "text-gray-400"}`}
                    />
                    <span className="text-xs font-bold">{c.code}</span>
                    <span className="text-[10px] text-gray-400 font-normal">
                      {c.symbol}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Min / Max inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-emerald-700/80 uppercase tracking-wider block mb-1.5">
                Minimum
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500 pointer-events-none">
                  {selectedCurrency.symbol}
                </span>
                <Input
                  type="number"
                  value={formData.salary.min || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      salary: {
                        ...p.salary,
                        min: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  placeholder="0"
                  className={`h-12 pl-8 rounded-xl border-2 bg-white text-sm font-medium transition-all focus:ring-4 focus:ring-emerald-100 ${
                    errors["salary.min"]
                      ? "border-red-400"
                      : "border-emerald-200 focus:border-emerald-400"
                  }`}
                />
                {minDisplay && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 pointer-events-none">
                    {minDisplay}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-emerald-700/80 uppercase tracking-wider block mb-1.5">
                Maximum
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500 pointer-events-none">
                  {selectedCurrency.symbol}
                </span>
                <Input
                  type="number"
                  value={formData.salary.max || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      salary: {
                        ...p.salary,
                        max: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  placeholder="0"
                  className={`h-12 pl-8 rounded-xl border-2 bg-white text-sm font-medium transition-all focus:ring-4 focus:ring-emerald-100 ${
                    errors["salary.max"]
                      ? "border-red-400"
                      : "border-emerald-200 focus:border-emerald-400"
                  }`}
                />
                {maxDisplay && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 pointer-events-none">
                    {maxDisplay}
                  </span>
                )}
              </div>
            </div>
          </div>

          {(formData.salary.min > 0 || formData.salary.max > 0) && (
            <div className="mt-3 px-4 py-2.5 bg-white rounded-xl border border-emerald-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                Displayed as:
              </span>
              <span className="text-sm font-bold text-emerald-700">
                {formData.salary.min > 0 && formData.salary.max > 0
                  ? `${selectedCurrency.symbol}${formData.salary.min.toLocaleString()} – ${selectedCurrency.symbol}${formData.salary.max.toLocaleString()} / year`
                  : formData.salary.min > 0
                    ? `${selectedCurrency.symbol}${formData.salary.min.toLocaleString()}+ / year`
                    : `Up to ${selectedCurrency.symbol}${formData.salary.max.toLocaleString()} / year`}
              </span>
            </div>
          )}

          <ErrorMsg msg={errors["salary.max"]} />
        </div>

        {/* Application Deadline */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md bg-rose-100 flex items-center justify-center">
              <Calendar className="w-3 h-3 text-rose-600" />
            </div>
            <label className="text-sm font-bold text-gray-800">
              Application Deadline <span className="text-red-400">*</span>
              {jobPostActiveDays && (
                <span className="ml-2 text-xs font-normal text-blue-600">
                  (Max {jobPostActiveDays} days)
                </span>
              )}
            </label>
          </div>
          <Input
            type="date"
            value={formData.expiresAt}
            min={todayString}
            max={jobPostActiveDays ? maxDateString : undefined}
            onChange={(e) =>
              setFormData((p) => ({ ...p, expiresAt: e.target.value }))
            }
            className="h-12 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 text-sm transition-all duration-200"
          />
          {formData.expiresAt && !errors.expiresAt && (
            <p className="text-xs text-emerald-600 mt-1.5 font-medium flex items-center gap-1">
              ✓ Closes{" "}
              {new Date(formData.expiresAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <ErrorMsg msg={errors.expiresAt} />
        </div>

        {/* External Link */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center">
              <LinkIcon className="w-3 h-3 text-blue-600" />
            </div>
            <label className="text-sm font-bold text-gray-800">
              External Application Link
              <span className="ml-2 text-xs font-normal text-gray-400">
                (optional)
              </span>
            </label>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 pointer-events-none">
              https://
            </span>
            <Input
              type="url"
              value={formData.externalLink}
              onChange={(e) =>
                setFormData((p) => ({ ...p, externalLink: e.target.value }))
              }
              placeholder="careers.yourcompany.com/apply/job-id"
              className="h-12 pl-16 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-sm transition-all duration-200 placeholder:text-gray-300"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 ml-1">
            Candidates will be redirected here to apply. Leave blank to use the
            built-in application flow.
          </p>
        </div>
      </div>
    </div>
  );
}
