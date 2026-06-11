import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Copy,
  CheckCheck,
  Bot,
  Search,
  CalendarCheck,
  X,
  Briefcase,
  Building2,
  Clock,
  ArrowRight,
  Sparkles,
  Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ApplicationSuccessModalProps {
  applicationId: string;
  jobTitle: string;
  companyName?: string;
  status: string;
  appliedAt: string;
  onClose: () => void;
  onContinueBrowsing: () => void;
}

const nextSteps = [
  {
    icon: Bot,
    title: "AI Resume Screening",
    description:
      "Our AI engine evaluates your resume against job requirements automatically.",
    time: "Within 24 hours",
    color: "bg-violet-50 text-violet-500 border-violet-200",
    connector: "bg-violet-100",
  },
  {
    icon: Search,
    title: "Recruiter Review",
    description:
      "Shortlisted candidates are reviewed by the recruiter for a final call.",
    time: "2–5 business days",
    color: "bg-blue-50 text-blue-500 border-blue-200",
    connector: "bg-blue-100",
  },
  {
    icon: CalendarCheck,
    title: "Interview Process",
    description:
      "If selected, you'll receive interview invitations and status updates.",
    time: "As scheduled",
    color: "bg-emerald-50 text-emerald-500 border-emerald-200",
    connector: null,
  },
];

const ApplicationSuccessModal: React.FC<ApplicationSuccessModalProps> = ({
  applicationId,
  jobTitle,
  companyName,
  status,
  appliedAt,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [, setVisible] = useState(false);

  const navigate = useNavigate();

  const handleViewApplications = () => {
    onClose();
    navigate("candidate/applications");
  };

  const handleContinueBrowsing = () => {
    onClose();
    navigate("/candidate/jobs");
  };
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch(err){
      console.log("err",err)
    }
  };

  const formattedDate = new Date(appliedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0.4); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ringExpand {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .modal-enter { animation: modalIn 0.24s cubic-bezier(0.34,1.56,0.64,1) both; }
        .check-pop   { animation: checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
        .ring-expand { animation: ringExpand 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.05s both; }
        .fade-up-1   { animation: fadeUp 0.35s ease 0.18s both; }
        .fade-up-2   { animation: fadeUp 0.35s ease 0.28s both; }
        .fade-up-3   { animation: fadeUp 0.35s ease 0.38s both; }
        .fade-up-4   { animation: fadeUp 0.35s ease 0.46s both; }
      `}</style>

      <div
        className="modal-enter bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "min(94vh, 820px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-0 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Application Confirmed
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex flex-col items-center text-center pt-6 pb-7">
            <div className="relative mb-5">
              <div
                className="ring-expand w-20 h-20 rounded-full border-[3px] border-emerald-200"
                style={{ boxShadow: "0 0 32px rgba(16,185,129,0.18)" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="check-pop w-14 h-14 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                  <CheckCircle2
                    className="w-7 h-7 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>

            <h2 className="fade-up-1 text-xl font-black text-slate-900 tracking-tight mb-2">
              Application Submitted!
            </h2>
            <p className="fade-up-1 text-sm text-slate-400 leading-relaxed max-w-xs">
              You're all set. A confirmation email is on its way to your inbox.
            </p>
          </div>

          <div className="fade-up-2 bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Application Details
            </h3>
            <div className="space-y-0">
              <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Hash className="w-3 h-3" /> App ID
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-600 font-semibold">
                    {applicationId}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center w-6 h-6 rounded-lg hover:bg-slate-200 transition-all"
                    title={copied ? "Copied!" : "Copy"}
                  >
                    {copied ? (
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 py-2.5 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                  <Briefcase className="w-3 h-3" /> Position
                </span>
                <span className="text-xs font-semibold text-slate-800 text-right leading-snug">
                  {jobTitle}
                </span>
              </div>

              {companyName && (
                <div className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-100">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                    <Building2 className="w-3 h-3" /> Company
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    {companyName}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
                <span className="text-xs text-slate-400">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-full uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3 h-3" /> Applied on
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="fade-up-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              What happens next?
            </h3>
            <div className="space-y-0">
              {nextSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center ${step.color}`}
                    >
                      <step.icon className="w-4 h-4" />
                    </div>
                    {step.connector && (
                      <div
                        className={`w-px flex-1 my-1.5 ${step.connector}`}
                        style={{ minHeight: "1.5rem" }}
                      />
                    )}
                  </div>

                  <div
                    className={`flex-1 min-w-0 ${idx < nextSteps.length - 1 ? "pb-5" : "pb-0"} pt-1`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-slate-800">
                        {step.title}
                      </p>
                      <span className="text-[11px] text-slate-400 font-medium shrink-0">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fade-up-4 shrink-0 border-t border-slate-100 px-6 py-4 bg-white/80 backdrop-blur-sm flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleViewApplications}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
              boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
            }}
          >
            View My Applications
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleContinueBrowsing}
            className="flex-1 inline-flex items-center justify-center py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            Browse More Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccessModal;
