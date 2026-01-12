import type React from "react";
import { useState } from "react";
import { ArrowLeft, Upload, X, Check, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { candidateService } from "../../services/candidate/candidate.service";

const CompleteProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    yearsOfExperience: "",
    educationLevel: "",
    preferredLocation: "",
    skills: [] as string[],
    linkedinUrl: "",
    resume: null as File | null,
  });

  const [skillInput, setSkillInput] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()],
        }));
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please login again.");
      setIsSubmitting(false);
      navigate("/signin");
      return;
    }

    const payload = {
      currentJob: formData.jobTitle || undefined,
      experienceYears: Number(formData.yearsOfExperience) || 0,
      educationLevel: formData.educationLevel || undefined,
      preferredJobLocation: formData.preferredLocation
        ? [formData.preferredLocation]
        : undefined,
      skills: formData.skills.length > 0 ? formData.skills : undefined,
      linkedinUrl: formData.linkedinUrl || undefined,
      profileCompleted: true,
    };

    try {
      await candidateService.completeProfile(payload);

      localStorage.setItem("profileCompleted", "true");
      navigate("/candidate/home");
    } catch (err: any) {
      console.error("❌ FRONTEND ERROR:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.clear();
        setTimeout(() => navigate("/signin"), 2000);
      } else if (err.response?.status === 400) {
        setError(
          err.response?.data?.message ||
            "Invalid data. Please check your inputs."
        );
      } else {
        setError("Failed to update profile. Please try again.");
      }

      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    console.log("⏭️ Skipping profile completion");
    navigate("/candidate/home");
  };

  const progressPercentage = 60;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-100 py-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-cyan-100 rounded-full blur-3xl opacity-10 animate-blob animation-delay-2000" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4">
        {/* Header with logo and back button */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-blue-600">RecruitFlow AI</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="mb-8 space-y-2 animate-slide-up">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 font-medium">Step 3 of 5</span>
            <span className="text-slate-600 font-semibold">
              {progressPercentage}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-full bg-linear-to-r from-blue-500 via-blue-600 to-cyan-500 rounded-full transition-all duration-700 shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Main form with enhanced styling */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up space-y-8 backdrop-blur-sm border border-white/80">
          {/* Title section */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
            <p className="text-slate-600">
              Help us find the perfect opportunities matched to your skills.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Job Title */}
            <div className="space-y-2 group">
              <label className="block text-sm font-semibold text-slate-900">
                Current Job Title
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("jobTitle")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g., Software Engineer, UI/UX Designer"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 ${
                  focusedField === "jobTitle"
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
                    : "border-slate-300 hover:border-slate-400"
                } focus:outline-none`}
              />
            </div>

            {/* Years of Experience */}
            <div className="space-y-2 group">
              <label className="block text-sm font-semibold text-slate-900">
                Years of Experience
              </label>
              <select
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("yearsOfExperience")}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 ${
                  focusedField === "yearsOfExperience"
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
                    : "border-slate-300 hover:border-slate-400"
                } focus:outline-none`}
              >
                <option value="">Select years of experience</option>
                <option value="0">0-2 years</option>
                <option value="2">2-5 years</option>
                <option value="5">5-10 years</option>
                <option value="10">10+ years</option>
              </select>
            </div>

            {/* Education Level */}
            <div className="space-y-2 group">
              <label className="block text-sm font-semibold text-slate-900">
                Education Level
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("educationLevel")}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 ${
                  focusedField === "educationLevel"
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
                    : "border-slate-300 hover:border-slate-400"
                } focus:outline-none`}
              >
                <option value="">Select highest education level</option>
                <option value="highschool">High School</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            {/* Preferred Location */}
            <div className="space-y-2 group">
              <label className="block text-sm font-semibold text-slate-900">
                Preferred Job Location
              </label>
              <input
                type="text"
                name="preferredLocation"
                value={formData.preferredLocation}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("preferredLocation")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g., New York, Remote, San Francisco"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 ${
                  focusedField === "preferredLocation"
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
                    : "border-slate-300 hover:border-slate-400"
                } focus:outline-none`}
              />
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">
                Resume Upload
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                  dragActive
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20 scale-105"
                    : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`transition-all duration-300 ${
                      dragActive ? "scale-110" : ""
                    }`}
                  >
                    {formData.resume ? (
                      <Check className="w-8 h-8 text-green-500" />
                    ) : (
                      <Upload className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 font-medium">
                    Drag & drop your resume here, or click to browse
                  </p>
                  <p className="text-xs text-slate-500">
                    PDF, DOC, DOCX up to 5MB
                  </p>
                </div>
                {formData.resume && (
                  <p className="mt-3 text-sm font-semibold text-green-600 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    {formData.resume.name}
                  </p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2 group">
              <label className="block text-sm font-semibold text-slate-900">
                Skills
              </label>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                onFocus={() => setFocusedField("skills")}
                onBlur={() => setFocusedField(null)}
                placeholder="Type skill and press Enter (e.g., React, TypeScript, Figma)"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 ${
                  focusedField === "skills"
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
                    : "border-slate-300 hover:border-slate-400"
                } focus:outline-none`}
              />
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.skills.map((skill) => (
                    <div
                      key={skill}
                      className="bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold
                        flex items-center gap-2 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-up"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-blue-900 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LinkedIn URL */}
            <div className="space-y-2 group">
              <label className="block text-sm font-semibold text-slate-900">
                LinkedIn Profile URL{" "}
                <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("linkedinUrl")}
                onBlur={() => setFocusedField(null)}
                placeholder="https://linkedin.com/in/yourprofile"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 ${
                  focusedField === "linkedinUrl"
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
                    : "border-slate-300 hover:border-slate-400"
                } focus:outline-none`}
              />
            </div>
          </form>

          <div className="flex items-start gap-3 p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:shadow-md transition-all">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-sm text-slate-700 cursor-pointer"
            >
              I accept the{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 underline font-semibold transition-colors"
              >
                Terms & Conditions
              </a>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 border-2 border-slate-300 rounded-lg font-semibold
                text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-linear-to-r from-blue-500 to-blue-600
                text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300
                hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:scale-100"
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="text-slate-600 hover:text-blue-600 font-semibold transition-colors duration-300
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompleteProfile;
