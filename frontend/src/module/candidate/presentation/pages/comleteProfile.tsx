// pages/CompleteCandidateProfile.tsx
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

import { useCompleteCandidateProfile } from "../hooks/useCompleteCandidateProfile";
import type { CompleteCandidateProfileForm } from "../types/candidate-profile.types";

export default function CompleteCandidateProfile() {
  const navigate = useNavigate();
  const { completeProfile, isSubmitting, error } = useCompleteCandidateProfile();

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
  // Separate validation error for skills so it shows inline
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (formErrors[name]) {
      setFormErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  // Shared skill-add logic used by both Enter key and the Add button
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (!formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillsError(null);
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Client-side validation before submit
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.educationLevel) errors.educationLevel = "Please select your education level.";
    if (!formData.bio.trim()) errors.bio = "Please write a short professional summary.";
    if (!formData.preferredJobLocations?.trim())
      errors.preferredJobLocations = "Please enter at least one preferred location.";

    if (formData.skills.length === 0) {
      setSkillsError("Please add at least one skill.");
      errors.skills = "required"; // sentinel
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // FIX: guard before sending — gives the user a clear error instead of
    // letting an empty skills array reach the backend and get a Zod error back.
    if (!validate()) return;

    try {
      await completeProfile({
        currentJob: formData.currentJob.trim(),
        experienceYears: formData.experienceYears
          ? String(formData.experienceYears)
          : undefined,
        educationLevel: formData.educationLevel,
        skills: formData.skills,
        preferredJobLocations: formData.preferredJobLocations ?? "",
        bio: formData.bio.trim(),
        linkedinUrl: formData.linkedinUrl?.trim() || undefined,
      });
      navigate("/candidate/home");
    } catch {
      // error state is set in the hook; nothing extra needed here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
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

        {/* API error banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-slate-200/70 overflow-hidden"
        >
          <div className="p-6 sm:p-8 space-y-7">

            {/* Current Job */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Briefcase className="h-4 w-4" />
                Current / Most Recent Job Title
              </label>
              <input
                name="currentJob"
                value={formData.currentJob}
                onChange={handleTextChange}
                placeholder="e.g. Full Stack Developer"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Experience Years */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Clock className="h-4 w-4" />
                Years of Professional Experience
              </label>
              <select
                name="experienceYears"
                value={formData.experienceYears ?? ""}
                onChange={handleTextChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none bg-white"
              >
                <option value="">Select range</option>
                <option value="0">0 – 2 years</option>
                <option value="2">2 – 5 years</option>
                <option value="5">5 – 10 years</option>
                <option value="10">10+ years</option>
              </select>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <GraduationCap className="h-4 w-4" />
                Highest Education Level <span className="text-red-500">*</span>
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleTextChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none bg-white ${
                  formErrors.educationLevel ? "border-red-400" : "border-slate-300"
                }`}
              >
                <option value="">Select level</option>
                <option value="highschool">High School</option>
                <option value="diploma">Diploma</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD or equivalent</option>
              </select>
              {formErrors.educationLevel && (
                <p className="text-xs text-red-600">{formErrors.educationLevel}</p>
              )}
            </div>

            {/* Preferred Location(s) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <MapPin className="h-4 w-4" />
                Preferred Job Location(s) <span className="text-red-500">*</span>
              </label>
              <input
                name="preferredJobLocations"
                value={formData.preferredJobLocations ?? ""}
                onChange={handleTextChange}
                placeholder="e.g. Remote, Kochi, Bengaluru"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400 ${
                  formErrors.preferredJobLocations ? "border-red-400" : "border-slate-300"
                }`}
              />
              <p className="text-xs text-slate-500">Separate multiple locations with commas</p>
              {formErrors.preferredJobLocations && (
                <p className="text-xs text-red-600">{formErrors.preferredJobLocations}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Sparkles className="h-4 w-4" />
                Key Skills <span className="text-red-500">*</span>
              </label>

              {/* FIX: added an explicit Add button alongside Enter key,
                  so users on mobile or who don't know to press Enter can add skills */}
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="e.g. React, Node.js, AWS"
                  className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400 ${
                    skillsError ? "border-red-400" : "border-slate-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              {skillsError && (
                <p className="text-xs text-red-600">{skillsError}</p>
              )}

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mt-3">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200/70 shadow-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-blue-700 hover:text-blue-900 transition-colors"
                        aria-label={`Remove skill ${skill}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText className="h-4 w-4" />
                Professional Summary / Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleTextChange}
                rows={4}
                placeholder="Highlight your experience, key achievements, career goals..."
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none resize-y min-h-[110px] placeholder:text-slate-400 ${
                  formErrors.bio ? "border-red-400" : "border-slate-300"
                }`}
              />
              {formErrors.bio && (
                <p className="text-xs text-red-600">{formErrors.bio}</p>
              )}
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Linkedin className="h-4 w-4" />
                LinkedIn Profile <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                name="linkedinUrl"
                value={formData.linkedinUrl ?? ""}
                onChange={handleTextChange}
                placeholder="https://www.linkedin.com/in/your-profile"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

          </div>

          {/* Actions */}
          <div className="px-6 sm:px-8 py-6 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row gap-4">
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
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
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