import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { completeProfileUC } from "../di/candidate";



const CompleteCandidateProfile: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentJob: "",
    experienceYears: "",
    educationLevel: "",
    preferredLocation: "",
    skills: [] as string[],
    skillInput: "",
    bio: "",
    linkedinUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && formData.skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(formData.skillInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, prev.skillInput.trim()],
          skillInput: "",
        }));
      }
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await completeProfileUC.execute({
        currentJob: formData.currentJob,
        experienceYears: Number(formData.experienceYears) || undefined,
        educationLevel: formData.educationLevel,
        skills: formData.skills,
        preferredJobLocations: formData.preferredLocation
          ? [formData.preferredLocation]
          : [],
        bio: formData.bio,
        linkedinUrl: formData.linkedinUrl || undefined,
      });

      navigate("/candidate/home");
    } catch (err: any) {
      setError(err.message || "Failed to complete profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            Complete Your Profile
          </h1>
          <div />
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Current Job */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Current Job Title
            </label>
            <input
              name="currentJob"
              value={formData.currentJob}
              onChange={handleChange}
              placeholder="Software Engineer"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Years of Experience
            </label>
            <select
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
            >
              <option value="">Select</option>
              <option value="0">0–2</option>
              <option value="2">2–5</option>
              <option value="5">5–10</option>
              <option value="10">10+</option>
            </select>
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Education Level
            </label>
            <select
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
            >
              <option value="">Select</option>
              <option value="highschool">High School</option>
              <option value="bachelor">Bachelor’s</option>
              <option value="master">Master’s</option>
              <option value="phd">PhD</option>
            </select>
          </div>

          {/* Preferred Location */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Preferred Job Location
            </label>
            <input
              name="preferredLocation"
              value={formData.preferredLocation}
              onChange={handleChange}
              placeholder="Remote / Bangalore"
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold mb-2">Skills</label>
            <input
              value={formData.skillInput}
              onChange={(e) =>
                setFormData((p) => ({ ...p, skillInput: e.target.value }))
              }
              onKeyDown={handleAddSkill}
              placeholder="Type skill and press Enter"
              className="w-full px-4 py-3 border rounded-xl"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-2 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              LinkedIn (Optional)
            </label>
            <input
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 border rounded-xl font-semibold"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </span>
              ) : (
                "Complete Profile"
              )}
            </button>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => navigate("/candidate/home")}
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteCandidateProfile;
