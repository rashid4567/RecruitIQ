import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, AlertCircle, Sparkles, TrendingUp } from "lucide-react";

interface BioSectionProps {
  register: any;
  errors: Record<string, any>;
  bioLength: number;
  wordCount: number;
  isEditing: boolean;
}

export function BioSection({
  register,
  errors,
  bioLength,
  wordCount,
  isEditing,
}: BioSectionProps) {
  const pct = Math.min((bioLength / 500) * 100, 100);
  const progressColor =
    bioLength > 450
      ? "bg-rose-500"
      : bioLength > 350
        ? "bg-amber-400"
        : "bg-emerald-500";

  const labelColor =
    bioLength > 450
      ? "text-rose-600 bg-rose-50 ring-1 ring-rose-200"
      : bioLength > 350
        ? "text-amber-600 bg-amber-50 ring-1 ring-amber-200"
        : "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200";

  return (
    <section className="space-y-5">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/25">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 leading-none">
            Professional Bio
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tell candidates what makes you a great recruiter
          </p>
        </div>
      </div>

      <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-200 focus-within:border-blue-400 focus-within:shadow-md focus-within:shadow-blue-500/10">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-3.5 pb-2 border-b border-slate-100 bg-slate-50/60">
          <Label
            htmlFor="bio"
            className="text-xs font-semibold text-slate-600 flex items-center gap-1.5"
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
            About You &amp; Your Company
            <span className="text-rose-500 ml-0.5">*</span>
          </Label>
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <TrendingUp className="h-3 w-3" />
              {wordCount} words
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-all duration-300 ${labelColor}`}
            >
              {bioLength}/500
            </span>
          </div>
        </div>

        {/* Textarea */}
        <Textarea
          id="bio"
          {...register("bio")}
          disabled={!isEditing}
          rows={6}
          className={`
            resize-none border-0 rounded-none bg-transparent focus-visible:ring-0
            focus-visible:ring-offset-0 text-sm text-slate-800 placeholder:text-slate-400
            px-4 py-3 leading-relaxed
            ${!isEditing ? "cursor-default text-slate-600" : ""}
          `}
          placeholder="Describe your professional background, specialisation areas, and what sets you apart as a recruiter. Candidates want to know your hiring philosophy and the kinds of roles you typically fill..."
        />

        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Footer hints */}
        <div className="px-4 py-2 bg-slate-50/60 border-t border-slate-100">
          {errors.bio ? (
            <p className="text-rose-500 text-xs flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.bio.message}
            </p>
          ) : bioLength < 10 && isEditing ? (
            <p className="text-amber-600 text-xs flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3 shrink-0" />
              Minimum 10 characters required
            </p>
          ) : bioLength > 450 ? (
            <p className="text-rose-500 text-xs flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3 shrink-0" />
              Approaching character limit — {500 - bioLength} remaining
            </p>
          ) : isEditing ? (
            <p className="text-slate-400 text-xs">
              A compelling bio increases candidate response rates by up to 40%
            </p>
          ) : (
            <p className="text-slate-400 text-xs">
              Click <span className="font-medium text-slate-500">Edit Profile</span> to update your bio
            </p>
          )}
        </div>
      </div>
    </section>
  );
}