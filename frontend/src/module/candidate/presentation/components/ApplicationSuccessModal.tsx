import React, { useState } from "react";
import { CheckCircle2, Copy, Bot, Search, CalendarCheck } from "lucide-react";
import { Button } from "./shared/Button";

interface ApplicationSuccessModalProps {
  onClose: () => void;
  onContinueBrowsing: () => void;
}

const ApplicationSuccessModal: React.FC<ApplicationSuccessModalProps> = ({
  onClose,
  onContinueBrowsing,
}) => {
  const [copied, setCopied] = useState(false);
  const trackingId = "RF-APP-2024-87654321";
  const nextSteps = [
    {
      icon: Bot,
      title: "AI Screening in 24 hours",
      description:
        "Our AI will review your application against job requirements for initial fit.",
    },
    {
      icon: Search,
      title: "Recruiter Review in 2-5 days",
      description:
        "A human recruiter will carefully evaluate your profile and qualifications.",
    },
    {
      icon: CalendarCheck,
      title: "Interview Invitation if shortlisted",
      description:
        "Successful candidates will receive an invitation to schedule an interview.",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-auto p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Your application has been submitted successfully!
        </h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          You will receive an email confirmation shortly with all the details of
          your submission.
        </p>

        <div className="flex items-center justify-center gap-3 bg-gray-100 rounded-lg px-4 py-3 mb-8">
          <span className="text-sm text-gray-500">Tracking ID:</span>
          <span className="font-mono font-medium text-gray-900">
            {trackingId}
          </span>
          <button
            onClick={handleCopy}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

  
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-6">
            What happens next?
          </h3>
          <div className="space-y-4">
            {nextSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-blue-500" />
                  </div>
                  {idx < nextSteps.length - 1 && (
                    <div className="w-0.5 h-full min-h-6 bg-gray-200 mt-2" />
                  )}
                </div>
                <div className="pt-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

   
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onClose}
          >
            View Application Status
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onContinueBrowsing}
          >
            Continue Browsing Jobs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccessModal;
