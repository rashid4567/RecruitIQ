import React, { useState } from "react";
import {
  X,
  ChevronRight,
  Briefcase,
  ChevronDown,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import type { JobPost } from "../../domain/entities/jobPost";

interface JobDetailModalProps {
  job: JobPost;
  onClose: () => void;
  onApply: () => void | Promise<void>;
  applying?: boolean;
  loading?: boolean;
}

const Button: React.FC<{
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled = false,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50",
    ghost: "hover:bg-gray-100 text-gray-600 disabled:opacity-50",
  };
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8",
  };
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Collapsible: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-left hover:bg-gray-50 px-2 -mx-2 rounded transition-colors"
      >
        <span className="font-semibold text-gray-900">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="pb-4 pt-2">{children}</div>}
    </div>
  );
};


const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="mb-6">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-24"></div>
        ))}
      </div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-b border-gray-200 pb-4">
          <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function JobDetailModal({
  job,
  onClose,
  onApply,
  applying = false,
  loading = false,
}: JobDetailModalProps) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-auto">

        <div className="border-b border-gray-200 p-4 sticky top-0 bg-white rounded-t-lg z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-blue-500">
                RecruitIQ
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>


        <div className="p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>

              <div className="mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">jobs</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">{job.title}</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
  
                <div className="flex-1">
                  <div className="mb-6">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                          {job.title}
                        </h1>
                        <p className="text-gray-600 mb-3">{job.department}</p>

       
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{job.formatLocation()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            <span>{job.formatExperience()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.jobTypeLabel()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.formatSalary()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>Posted {job.postedAgo()}</span>
                          </div>
                          {job.positions > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              <span>
                                {job.positions} opening
                                {job.positions !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 shadow-md hover:shadow-lg transition-all"
                        onClick={onApply}
                        disabled={applying}
                      >
                        {applying ? "Applying..." : "Apply Now"}
                      </Button>
                    </div>
                  </div>


                  <div className="space-y-4">
                    {job.description && (
                      <Collapsible title="Job Description" defaultOpen>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                          {job.description}
                        </p>
                      </Collapsible>
                    )}

                    {!job.description && (
                      <Collapsible title="Job Description" defaultOpen>
                        <p className="text-gray-500 text-sm italic">
                          No description available for this position.
                        </p>
                      </Collapsible>
                    )}

                    {job.responsibilities &&
                      job.responsibilities.length > 0 && (
                        <Collapsible title="Key Responsibilities" defaultOpen>
                          <ul className="space-y-2">
                            {job.responsibilities.map((resp, idx) => (
                              <li
                                key={idx}
                                className="flex gap-2 text-sm text-gray-600"
                              >
                                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </Collapsible>
                      )}

                    {job.requirements && job.requirements.length > 0 && (
                      <Collapsible title="Requirements" defaultOpen>
                        <ul className="space-y-2">
                          {job.requirements.map((req, idx) => (
                            <li
                              key={idx}
                              className="flex gap-2 text-sm text-gray-600"
                            >
                              <Award className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </Collapsible>
                    )}

                    {job.preferredSkills && job.preferredSkills.length > 0 && (
                      <Collapsible title="Preferred Skills" defaultOpen>
                        <div className="flex flex-wrap gap-2">
                          {job.preferredSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </Collapsible>
                    )}

                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <Collapsible title="Required Skills" defaultOpen>
                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </Collapsible>
                    )}
                  </div>


                  {job.externalLink && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <a
                        href={job.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View on Company Website
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>

  
                <div className="w-full lg:w-80 space-y-6">

                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-500" />
                      AI Match Score
                    </h3>
                    <div className="flex justify-center mb-3">
                      <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            strokeDasharray="251.2"
                            strokeDashoffset="75.36"
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-blue-500">
                            85%
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Based on your skills and experience
                    </p>
                  </div>

      
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-md font-semibold text-gray-900 mb-3">
                      Job Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Experience</span>
                        <span className="text-gray-900 font-medium">
                          {job.formatExperience()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Job Type</span>
                        <span className="text-gray-900 font-medium">
                          {job.jobTypeLabel()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Salary Range</span>
                        <span className="text-gray-900 font-medium">
                          {job.formatSalary()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Location</span>
                        <span className="text-gray-900 font-medium">
                          {job.formatLocation()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Applications</span>
                        <span className="text-gray-900 font-medium">
                          {job.applicationsCount}
                        </span>
                      </div>
                      {job.views !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Views</span>
                          <span className="text-gray-900 font-medium">
                            {job.views}
                          </span>
                        </div>
                      )}
                      {job.expiresAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Apply Before</span>
                          <span className="text-red-500 font-medium">
                            {new Date(job.expiresAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>


                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                      <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.slice(0, 8).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.requiredSkills.length > 8 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{job.requiredSkills.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
