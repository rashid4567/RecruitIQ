import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  X,
  Briefcase,
  Clock,
  GraduationCap,
  MapPin,
  Sparkles,
  FileText,
  Linkedin,
  Plus,
} from "lucide-react";
import { type ZodIssue } from "zod";

import { useCompleteCandidateProfile } from "../hooks/useCompleteCandidateProfile";
import type { CompleteCandidateProfileForm } from "../types/candidate-profile.types";
import { candidateProfileSchema } from "../validators/complete-profile.validation";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

function inputCls(hasError: boolean, extra = "") {
  return [
    "w-full px-4 py-3 border rounded-xl outline-none transition-all placeholder:text-slate-400",
    "focus:ring-2",
    hasError
      ? "border-red-400 bg-red-50/50 focus:ring-red-200 focus:border-red-500"
      : "border-slate-300 bg-white focus:ring-blue-500 focus:border-blue-400",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function CompleteCandidateProfile() {
  const navigate = useNavigate();
  const { completeProfile, isSubmitting, error } =
    useCompleteCandidateProfile();

  const [formData, setFormData] = useState<CompleteCandidateProfileForm>({
    currentJob: "",
    experienceYears: "",
    educationLevel: "",
    skills: [],
    preferredJobLocations: "",
    bio: "",
    linkedinUrl: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const clearError = (name: string) =>
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });

  const handleTextChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitted) clearError(name);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (!formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      if (submitted) clearError("skills");
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skill: string) =>
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));

  const validate = (): boolean => {
    const result = candidateProfileSchema.safeParse({
      ...formData,
      preferredJobLocations: formData.preferredJobLocations
        ? formData.preferredJobLocations
            .split(",")
            .map((location) => location.trim())
            .filter(Boolean)
        : [],
      linkedinUrl: formData.linkedinUrl?.trim() || undefined,
    });

    if (result.success) {
      setFieldErrors({});
      return true;
    }

    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue: ZodIssue) => {
      const key = issue.path[0] as string;
      if (!errors[key]) errors[key] = issue.message;
    });
    setFieldErrors(errors);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;

    try {
      await completeProfile({
        currentJob: formData.currentJob.trim(),
        experienceYears: formData.experienceYears
          ? String(formData.experienceYears)
          : undefined,
        educationLevel: formData.educationLevel,
        skills: formData.skills,
        preferredJobLocations: formData.preferredJobLocations,
        bio: formData.bio.trim(),
        linkedinUrl: formData.linkedinUrl?.trim() || undefined,
      });
      navigate("/candidate/home");
    } catch (err) {
      console.error(err);
    }
  };

  const errorCount = Object.keys(fieldErrors).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-3 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6 text-slate-700" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Complete Your Profile
          </h1>
          <div className="w-10" />
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted && errorCount > 0 && (
          <div className="mb-5 p-4 bg-red-50 border border-red-300 rounded-xl flex items-start gap-3 text-sm">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-red-500" />
            <div>
              <p className="font-semibold text-red-800">
                Please fix {errorCount} error{errorCount > 1 ? "s" : ""} before
                continuing.
              </p>
              <ul className="mt-1.5 space-y-0.5 list-disc list-inside text-red-700">
                {Object.values(fieldErrors).map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-2xl shadow-lg border border-slate-200/70 overflow-hidden"
        >
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Briefcase className="h-4 w-4 text-slate-400" />
                Current / Most Recent Job Title
                <span className="text-red-500">*</span>
              </label>
              <input
                name="currentJob"
                value={formData.currentJob}
                onChange={handleTextChange}
                placeholder="e.g. Full Stack Developer"
                className={inputCls(!!fieldErrors.currentJob)}
              />
              <FieldError message={fieldErrors.currentJob} />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Clock className="h-4 w-4 text-slate-400" />
                Years of Professional Experience
                <span className="text-red-500">*</span>
              </label>
              <select
                name="experienceYears"
                value={formData.experienceYears ?? ""}
                onChange={handleTextChange}
                className={inputCls(!!fieldErrors.experienceYears)}
              >
                <option value="">Select range</option>
                <option value="0">0 – 2 years</option>
                <option value="2">2 – 5 years</option>
                <option value="5">5 – 10 years</option>
                <option value="10">10+ years</option>
              </select>
              <FieldError message={fieldErrors.experienceYears} />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                Highest Education Level
                <span className="text-red-500">*</span>
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleTextChange}
                className={inputCls(!!fieldErrors.educationLevel)}
              >
                <option value="">Select level</option>
                <option value="highschool">High School</option>
                <option value="diploma">Diploma</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD or equivalent</option>
              </select>
              <FieldError message={fieldErrors.educationLevel} />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <MapPin className="h-4 w-4 text-slate-400" />
                Preferred Job Location(s)
                <span className="text-red-500">*</span>
              </label>
              <input
                name="preferredJobLocations"
                value={formData.preferredJobLocations ?? ""}
                onChange={handleTextChange}
                placeholder="e.g. Remote, Kochi, Bengaluru"
                className={inputCls(!!fieldErrors.preferredJobLocations)}
              />
              <p className="text-xs text-slate-400">
                Separate multiple locations with commas
              </p>
              <FieldError message={fieldErrors.preferredJobLocations} />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Sparkles className="h-4 w-4 text-slate-400" />
                Key Skills
                <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="e.g. React, Node.js, AWS — press Enter to add"
                  className={inputCls(!!fieldErrors.skills)}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-100 active:bg-blue-200 transition-colors font-medium flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              <FieldError message={fieldErrors.skills} />

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200/80"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-blue-500 hover:text-blue-900 transition-colors"
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText className="h-4 w-4 text-slate-400" />
                Professional Summary / Bio
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleTextChange}
                rows={4}
                placeholder="Highlight your experience, key achievements, and career goals..."
                className={inputCls(!!fieldErrors.bio, "resize-y min-h-27.5")}
              />
              <div className="flex items-start justify-between gap-2">
                <FieldError message={fieldErrors.bio} />
                <span
                  className={`text-xs shrink-0 ml-auto tabular-nums ${
                    formData.bio.length > 1000
                      ? "text-red-500 font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  {formData.bio.length} / 1000
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Linkedin className="h-4 w-4 text-slate-400" />
                LinkedIn Profile
                <span className="text-slate-400 font-normal text-xs">
                  (optional)
                </span>
              </label>
              <input
                name="linkedinUrl"
                value={formData.linkedinUrl ?? ""}
                onChange={handleTextChange}
                placeholder="https://www.linkedin.com/in/your-profile"
                className={inputCls(!!fieldErrors.linkedinUrl)}
              />
              <FieldError message={fieldErrors.linkedinUrl} />
            </div>
          </div>

          <div className="px-6 sm:px-8 py-6 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-6 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Complete Profile"
              )}
            </button>
          </div>

          <div className="py-5 text-center text-sm text-slate-500">
            <button
              type="button"
              onClick={() => navigate("/candidate/home")}
              className="hover:text-blue-700 transition-colors underline underline-offset-2"
            >
              Skip for now → complete later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
