// Step5Preview.tsx
import { Calendar, MapPin, Briefcase, DollarSign, Building2, Users, Link as LinkIcon, Clock } from "lucide-react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Step5PreviewProps {
  formData: JobFormData;
}

export default function Step5Preview({ formData }: Step5PreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return "Not specified";
    const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
    if (min && max) return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()} / year`;
    if (min) return `${symbol}${min.toLocaleString()}+ / year`;
    if (max) return `Up to ${symbol}${max.toLocaleString()} / year`;
    return "Not specified";
  };

  const formatExperience = (min: number, max: number) => {
    if (!min && !max) return "Not specified";
    if (min === max && min > 0) return `${min}+ years`;
    if (min && max) return `${min} - ${max} years`;
    if (min) return `${min}+ years`;
    if (max) return `Up to ${max} years`;
    return "Not specified";
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Preview Your Job Post</h2>
        <p className="text-gray-500 mt-1">Review all the details before publishing</p>
      </div>

      <div className="border rounded-2xl p-8 bg-white shadow-sm space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{formData.title || "Untitled Position"}</h3>
          
          {/* Job Meta Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm capitalize">
              {formData.jobType.replace("-", " ")}
            </span>
            {formData.isRemote ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Remote</span>
            ) : formData.location.city && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {[formData.location.city, formData.location.state].filter(Boolean).join(", ")}
              </span>
            )}
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              {formData.department || "General"}
            </span>
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Experience</p>
              <p className="font-medium">{formatExperience(formData.experienceMin, formData.experienceMax)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Salary</p>
              <p className="font-medium">{formatSalary(formData.salary.min, formData.salary.max, formData.salary.currency)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Positions</p>
              <p className="font-medium">{formData.positions} {formData.positions === 1 ? "opening" : "openings"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Deadline</p>
              <p className="font-medium">{formatDate(formData.expiresAt)}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {formData.description && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">About the Role</h4>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {formData.description}
            </p>
          </div>
        )}

        {/* Responsibilities */}
        {formData.responsibilities.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Key Responsibilities</h4>
            <ul className="space-y-2">
              {formData.responsibilities.map((item, i) => (
                <li key={i} className="flex gap-2 text-gray-600">
                  <span className="text-indigo-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {formData.requirements.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
            <ul className="space-y-2">
              {formData.requirements.map((item, i) => (
                <li key={i} className="flex gap-2 text-gray-600">
                  <span className="text-amber-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {formData.requiredSkills.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {formData.requiredSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {formData.preferredSkills.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Preferred Skills</h4>
            <div className="flex flex-wrap gap-2">
              {formData.preferredSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* External Link */}
        {formData.externalLink && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <LinkIcon className="w-4 h-4" />
              <span>External Application: </span>
              <a href={formData.externalLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                {formData.externalLink}
              </a>
            </div>
          </div>
        )}

        {/* Missing Fields Warning */}
        {(!formData.title || !formData.description || formData.requiredSkills.length === 0) && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-800 text-sm">
              ⚠️ Missing required fields: 
              {!formData.title && " Title"}
              {!formData.description && " Description"}
              {formData.requiredSkills.length === 0 && " Required Skills"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}