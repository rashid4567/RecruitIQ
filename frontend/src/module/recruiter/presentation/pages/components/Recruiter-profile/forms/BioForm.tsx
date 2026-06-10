import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, AlertCircle, Sparkles, Hash } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { RecruiterProfileFormValues } from "@/module/recruiter/presentation/types/recruiterProfileFormValues";

interface BioSectionProps {
  register: UseFormRegister<RecruiterProfileFormValues>;
  errors: FieldErrors<RecruiterProfileFormValues>;
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
  const max = 500;
  const pct = Math.min((bioLength / max) * 100, 100);

  const charState =
    bioLength > 450 ? "danger" : bioLength > 350 ? "warn" : "ok";

  const progressColor =
    charState === "danger"
      ? "bg-red-500"
      : charState === "warn"
        ? "bg-amber-400"
        : bioLength > 0
          ? "bg-blue-500"
          : "bg-slate-200";

  const counterColor =
    charState === "danger"
      ? "text-red-600 bg-red-50 ring-1 ring-red-200"
      : charState === "warn"
        ? "text-amber-600 bg-amber-50 ring-1 ring-amber-200"
        : "text-slate-500 bg-slate-100";

  const borderFocus =
    errors.bio
      ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-500/10"
      : isEditing
        ? "border-slate-200 focus-within:border-blue-400 focus-within:ring-blue-500/10"
        : "border-slate-200";

  const footerMessage = () => {
    if (errors.bio) {
      return (
        <span className="flex items-center gap-1.5 text-red-500">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {errors.bio.message}
        </span>
      );
    }
    if (bioLength < 10 && isEditing) {
      return (
        <span className="flex items-center gap-1.5 text-amber-600">
          <AlertCircle className="h-3 w-3 shrink-0" />
          Minimum 10 characters required
        </span>
      );
    }
    if (charState === "danger") {
      return (
        <span className="flex items-center gap-1.5 text-red-500">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {max - bioLength} characters remaining
        </span>
      );
    }
    if (isEditing) {
      return (
        <span className="text-slate-400">
          A strong bio increases candidate replies by up to 40%
        </span>
      );
    }
    return (
      <span className="text-slate-400">
        Click{" "}
        <span className="font-medium text-slate-500">Edit Profile</span> to
        update your bio
      </span>
    );
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/25">
          <FileText className="h-4.5 w-4.5 text-white" />
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

      <div
        className={`rounded-2xl border bg-white overflow-hidden transition-all duration-200 focus-within:shadow-md focus-within:ring-2 ${borderFocus}`}
      >
        <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5 border-b border-slate-100 bg-slate-50/60">
          <Label
            htmlFor="bio"
            className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            About You &amp; Your Company
            <span className="text-red-500 ml-0.5">*</span>
          </Label>
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Hash className="h-3 w-3" />
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full tabular-nums transition-all duration-300 ${counterColor}`}
            >
              {bioLength}/{max}
            </span>
          </div>
        </div>

        <Textarea
          id="bio"
          {...register("bio")}
          disabled={!isEditing}
          rows={6}
          className={`
            resize-none border-0 rounded-none bg-transparent
            focus-visible:ring-0 focus-visible:ring-offset-0
            text-sm leading-relaxed text-slate-800
            placeholder:text-slate-400
            px-4 py-3.5
            ${!isEditing ? "cursor-default text-slate-600" : ""}
          `}
          placeholder="Share your recruiting background, areas of specialisation, and hiring philosophy. What kinds of roles do you typically fill, and what do you look for in candidates?"
        />

        <div className="h-0.5 bg-slate-100">
          <div
            className={`h-full transition-all duration-500 ease-out ${progressColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="px-4 py-2.5 bg-slate-50/60 border-t border-slate-100 min-h-9 flex items-center">
          <p className="text-[11px] font-medium">{footerMessage()}</p>
        </div>
      </div>
    </section>
  );
}