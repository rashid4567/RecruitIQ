import React, { useState } from "react";
import { CheckCircle2, Copy, Bot, Search, CalendarCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicationSuccessModalProps {
  applicationId: string;
  jobTitle: string;
  companyName?: string;
  status: string;
  appliedAt: string;
  onClose: () => void;
  onContinueBrowsing: () => void;
}

const ApplicationSuccessModal: React.FC<ApplicationSuccessModalProps> = ({
  applicationId,
  jobTitle,
  companyName,
  status,
  appliedAt,
  onClose,
  onContinueBrowsing,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const nextSteps = [
    {
      icon: Bot,
      title: "Resume Screening",
      description: "Our AI engine evaluates your resume against job requirements.",
      time: "Within 24 hours",
    },
    {
      icon: Search,
      title: "Recruiter Review",
      description: "The recruiter reviews shortlisted applications.",
      time: "2-5 business days",
    },
    {
      icon: CalendarCheck,
      title: "Interview Process",
      description: "If selected, you'll receive interview invitations and updates.",
      time: "As needed",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
        {/* Header with close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 pb-8 text-center -mt-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-gray-600 text-sm mb-8">
            Thank you for applying. You will receive a confirmation email shortly.
          </p>

          {/* Application Details Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-4 text-lg">
              Application Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Application ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-gray-900">{applicationId}</span>
                  <button
                    onClick={handleCopy}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                    title={copied ? "Copied!" : "Copy Application ID"}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Position</span>
                <span className="font-medium text-gray-900 text-right">{jobTitle}</span>
              </div>

              {companyName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Company</span>
                  <span className="font-medium text-gray-900">{companyName}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold uppercase tracking-wide">
                  {status}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Applied On</span>
                <span className="text-gray-900">
                  {new Date(appliedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps Timeline */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              What happens next?
            </h3>
            <div className="space-y-6">
              {nextSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    {idx < nextSteps.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                    )}
                  </div>

                  <div className="flex-1 text-left pt-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{step.title}</p>
                      <span className="text-xs text-gray-500 font-medium">{step.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium"
            >
              View My Applications
            </Button>
            <Button
              variant="outline"
              onClick={onContinueBrowsing}
              className="flex-1 py-6 text-base font-medium"
            >
              Browse More Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccessModal;